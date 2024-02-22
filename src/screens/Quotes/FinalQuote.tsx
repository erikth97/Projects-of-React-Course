import React, { useEffect, useLayoutEffect, useState } from "react";
import { Platform, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import { IQuote, IQuoteDetails, IPatient, IHospital, IDoctor } from "../../common/Interfaces";
import { DEFAULT_COSTS_MIN_MARGIN, DEFAULT_COSTS_SUGGESTED_MARGIN } from "../../common/config";
import { ROUTES } from "../../common/routes";
import { QuoteStatus } from "../../common/storage_keys";
import { ColorType } from "native-base/lib/typescript/components/types";
import { CurrencyFormatter } from "../../common/functions";
import { FinalQuoteTotalInput } from "../../components/Modals/ModalFinalQuoteTotalInput";
import { ModalFinalQuoteAdditionalMaterial } from "../../components/Modals/ModalFinalQuoteAdditionalMaterial";
import { FinalQuoteDuplicateQuote } from "../../components/Modals/ModalDuplicateQuote";
import { emptyDoctor } from "../../common/emptyObjects";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { DownloadQuotePDF } from "./QuoteDownloader/DownloadQuotePDF";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, Divider, Backdrop, CircularProgress } from "@mui/material";
import { FinalQuoteLine } from "../../components/FinalQuoteLine";
import { FinalQuoteLine2Columns } from "../../components/FinalQuoteLine2Columns";
import { AlertDialog } from "../../components/Modals/ModalAlert";
import userServices from "../../services/userServices";
import quoteServices from "../../services/quoteServices";
import hospitalServices from "../../services/hospitalServices";
import patientServices from "../../services/patientServices";
import doctorServices from "../../services/doctorServices";
import { SideQuoteInfo } from "../../components/SideQuoteInfo";

const colors: Array<{ min: number; max: number; color: ColorType }> = [
  { min: Number.MIN_SAFE_INTEGER, max: 0.5999, color: "red.600" },
  { min: 0.5999, max: 0.6999, color: "yellow.600" },
  { min: 0.6999, max: 0.7999, color: "green.600" },
  { min: 0.7999, max: Number.MAX_SAFE_INTEGER, color: "purple.600" },
];

export const FinalQuote = ({ navigation, route }: { navigation: any; route: any }) => {
  const context = useContext(AppContext);

  const { source, status, quote }: { source: string; status: string; quote: IQuote } = route.params;
  const [marginColor, setMarginColor] = useState<ColorType>("black");
  const [showInputTotal, setShowInputTotal] = useState<boolean>(false);
  const [showMaterialInput, setShowMaterialInput] = useState<boolean>(false);
  const [showDuplicateCode, setShowDuplicateCode] = useState<boolean>(false);
  const [creatingPDF, setCreatingPDF] = useState<boolean>(false);
  const [doctor, setDoctor] = useState<IDoctor>({ ...emptyDoctor });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [titleAlert, setTitleAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<boolean>(false);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(true);
  const [funcBack, setFuncBack] = useState<boolean>(true);

  const [openPdfDownloader, setOpenPDfDownloader] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          tintColor="#FFF"
          labelVisible={Platform.OS === "ios"}
          label={status === QuoteStatus.FINISHED ? source : "Cancelar"}
          onPress={() => goBack()}
        />
      ),
    });
  }, [navigation, status]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // * If there's no quote, then go back
      if (!quote) {
        navigation.goBack();
      }

      if (status === QuoteStatus.FINISHED && quote.quote_number) {
        getQuote(quote.quote_number);
      } else {
        setShowBackdrop(true);

        const today = new Date();
        const today90 = new Date();
        today90.setDate(today.getDate() + 10);
        const validUntil = today90.toISOString().substring(0, 10);
        const current_date = today.toISOString().substring(0, 10);
        const details_json = JSON.stringify(quote.quote_details, null, 0);

        if (!quote.quote_details) navigation.goBack();

        // * Set total cost value
        const total_cost = quote.quote_details.total_cost || 0;
        const total_price = quote.quote_details.subtotal_price;
        console.log(total_cost);

        // * Set mark up value
        const markup = quote.quote_details.additional_material.total_price;
        console.log("MARKUP:", markup);

        const q: IQuote = {
          ...quote,
          details_json: details_json,
          valid_until: validUntil,
          update_date: current_date,
          cost: total_cost,
          // ! CHECK FORMULA
          suggested_total: (total_cost * -1) / (DEFAULT_COSTS_SUGGESTED_MARGIN - 1),
          // ! CHEK FORMULA
          min_total: (total_cost * -1) / (DEFAULT_COSTS_MIN_MARGIN - 1),
          quote_details: quote.quote_details,
        };
        console.log("SUGGESTED_TOTAL:", q.suggested_total, " MIN_TOTAL:", q.min_total);
        const margen_contribucion = 1 - total_cost / total_price;
        //const precio = -(3 * markup - 10 * total_cost) / 3;
        const subtotal = -1 * (total_cost / (margen_contribucion - 1));
        console.log("PRECIO: ", total_price);
        q.subtotal = subtotal;
        q.total = subtotal + markup;
        q.margin = margen_contribucion;
        q.discount = total_price - subtotal;
        navigation.setParams({ quote: q });
        changeMarginColor(q.margin);
        console.log("MARGEN DE CONTIBUCIÓN: ", margen_contribucion);
        setShowBackdrop(false);
      }
    });
    return unsubscribe;
  }, [navigation, quote]);

  // * Function for get quote number and its details //
  const getQuote = async (quote_number: string) => {
    quoteServices.getQuoteByNumber(quote_number).then((res) => {
      let q: IQuote = res;
      const qDetail: IQuoteDetails = JSON.parse(q.details_json || "");
      q.quote_details = qDetail;
      getValues(q);
    });
  };

  const getValues = async (q: IQuote) => {
    patientServices.getPatientByID(q.patient_id).then((patientRes) => {
      doctorServices.getDoctorById(q.doctor_id).then((doctorRes) => {
        hospitalServices.getHospitalById(q.hospital_id).then((hospitalRes) => {
          const patientData: IPatient = patientRes;
          const doctorData: IDoctor = doctorRes;
          const hospitalData: IHospital = hospitalRes;
          setDoctor({
            ...doctor,
            names: doctorData.names,
            assistant_name: doctorData.assistant_name,
            email: doctorData.email,
            first_surname: doctorData.first_surname,
            id: doctorData.id,
            office_address: doctorData.office_address,
            phone: doctorData.phone,
            professional_license: doctorData.professional_license,
            second_surname: doctorData.second_surname,
            speciality: doctorData.speciality,
            speciality_card: doctorData.speciality_card,
          });
          navigation.setParams({
            quote: {
              ...q,
              patient: patientData,
              doctor: doctorData,
              hospital: hospitalData,
            },
          });
          setShowBackdrop(false);
        });
      });
    });
  };

  // * Function to create a new quote from scratch //
  const createQuote = async () => {
    setShowBackdrop(true);
    let user = await userServices.getUserIdByEmail(context.email);
    quote.user_id = user.user_id;
    const data: IQuote = {
      ...quote,
      id: quote.id,
      quote_number: quote.quote_number,
      valid_until: quote.valid_until,
      created_at: quote.created_at,
    };

    quoteServices.insertQuote(data).then((response) => {
      console.log(response.quote_number);
      if (response) {
        // refresh quote data
        data.id = response.id;
        data.quote_number = response.quote_number;
        navigation.setParams({ status: QuoteStatus.FINISHED, quote: data });
      } else {
        setTypeAlert(true);
        setShowAlert(true);
        setTitleAlert("Cotizacion no creada");
        setMessageAlert("");
      }
      setShowBackdrop(false);
    });
  };

  // * Function to update quote details when edited //
  const updateQuote = async () => {
    if (!quote) return;
    setShowBackdrop(true);
    let user = await userServices.getUserIdByEmail(context.email);
    quote.user_id = user.user_id;
    quoteServices.updateQuote(quote.id!, quote).then((status) => {
      if (status === 200) {
        getQuote(quote.quote_number as any);
        navigation.setParams({ status: QuoteStatus.FINISHED });
        setShowBackdrop(false);
      }
    });
  };

  // * Send to Edit Quote page with the quote ID //
  const editQuote = () => navigation.navigate(ROUTES.EDIT_QUOTE, { quote, source, isEdit: status !== QuoteStatus.NEW });

  // * Function for delete a quote, this deletes the quote
  const archiveQuote = async () => {
    setShowBackdrop(true);
    quoteServices.deleteQuote(quote.id!).then((status) => {
      if (status == 200) {
        navigation.navigate(source, { doctor: quote.doctor });
        navigation.navigate(ROUTES.FIND_DOCTOR);
        setShowBackdrop(false);
      }
    });
  };

  const duplicateQuote = (q: IQuote) => {
    setShowDuplicateCode(false);
    navigation.push(ROUTES.QUOTE_SUMMARY, { quote: q, source, status: QuoteStatus.NEW });
  };

  const goBack = () => {
    if (status === QuoteStatus.FINISHED) {
      getQuote(quote.quote_number!);
      navigation.navigate(source, { doctor: quote.doctor });
    } else {
      setTypeAlert(false);
      setFuncBack(true);
      setShowAlert(true);
      setTitleAlert("¿Seguro que quieres regresar?");
      setMessageAlert("Todos los cambios se perderan.");
    }
  };

  const goBackPage = () => {
    navigation.navigate(source, { doctor: quote.doctor });
  };

  const onChangeTotal = (new_price: number) => {
    setShowInputTotal(false);
    const add_material_price = quote.quote_details.additional_material.total_price;
    const cost = quote.quote_details.total_cost;
    let price = new_price + add_material_price;

    //const margin = price / quote.subtotal;
    const q: IQuote = {
      ...quote,
      total: price,
      subtotal: new_price,
      //discount: price - quote.subtotal,
      discount: price - quote.quote_details.subtotal_price - quote.quote_details.additional_material.total_price,
      suggested_total: cost / (1 - DEFAULT_COSTS_SUGGESTED_MARGIN) + add_material_price,
      min_total: cost / (1 - DEFAULT_COSTS_MIN_MARGIN) + add_material_price,
      //margin: margin,
    };

    const margin = (q.total - q.cost) / q.total;
    q.margin = margin;

    navigation.setParams({ quote: q });
    if (status === QuoteStatus.FINISHED) navigation.setParams({ status: QuoteStatus.EDITED });
    changeMarginColor(margin);
  };

  const onChangeMaterial = (add_material_price: number) => {
    setShowMaterialInput(false);
    const cost = quote.quote_details.total_cost;
    //let price = quote.total - quote.quote_details.additional_material.total_price;
    let price = quote.subtotal;
    //let price = quote.total;

    const add_material_cost = quote.quote_details.additional_material.total_cost;
    //const subtotal_anterior = quote.subtotal - quote.quote_details.additional_material.total_price;

    const q: IQuote = {
      ...quote,
      total: price + add_material_price,
      //total: price,
      margin: (price + add_material_price - cost) / (price + add_material_price),
      //subtotal: subtotal_anterior + add_material_price,
      discount: price - (quote.quote_details.subtotal_price + add_material_price),
      suggested_total: cost / (1 - DEFAULT_COSTS_SUGGESTED_MARGIN) + add_material_price,
      min_total: cost / (1 - DEFAULT_COSTS_MIN_MARGIN) + add_material_price,
      additional_material_margin: 1 - add_material_cost / add_material_price,
    };
    q.quote_details.additional_material.margin = (add_material_price - add_material_cost) / add_material_cost;
    q.quote_details.additional_material.total_price = add_material_price;

    quote.quote_details.additional_material.total_price = add_material_price;
    const details_json = JSON.stringify(q.quote_details, null, 0);
    q.details_json = details_json;
    quote.details_json = details_json;

    navigation.setParams({ quote: q });
    if (status === QuoteStatus.FINISHED) navigation.setParams({ status: QuoteStatus.EDITED });
    changeMarginColor(q.margin);
  };

  const changeMarginColor = (margin: number) => {
    const { color }: { color: ColorType } = colors.filter((x) => margin >= x.min && margin < x.max).shift() || {
      min: 0,
      max: 0,
      color: "black",
    };
    setMarginColor(color);
  };

  return (
    <LinearGradient colors={["#671E75", "#A12CB8"]} style={{ minHeight: "100%" }}>
      <Stack direction={"row"} style={{ justifyContent: "space-between" }}>
        <Stack direction={"column"} style={{ flex: 1 }}>
          <SideQuoteInfo
            quote_number={quote.quote_number}
            doctor={quote.doctor!}
            patient={quote.patient}
            procedure={quote.mprocedure_name}
            hospital={quote.hospital}
            total={CurrencyFormatter.format(quote.total || 0)}
          />
        </Stack>
        <Stack direction={"column"} style={{ flex: 3, marginRight: "3%" }}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              width: "100%",
              height: "99%",
              paddingVertical: "1%",
              paddingHorizontal: "1%",
              borderRadius: 10,
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <ScrollView>
              <View
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  backgroundColor: "#E0E0E0",
                  borderRadius: 4,
                  paddingVertical: "1%",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}> Servicio</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>Detalle</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>Total</Text>
                  </View>
                </View>
              </View>
              <FinalQuoteLine
                titulo=" Estancia"
                detalle={
                  quote.quote_details!.room.amount
                    ? `${quote.quote_details!.room.amount} días en ${quote.quote_details!.room.category}`
                    : ""
                }
                total={quote.quote_details!.room.total_price}
              />
              <FinalQuoteLine
                titulo=" Tipo de sala"
                detalle={
                  quote.quote_details!.surgical_suite.amount
                    ? `${quote.quote_details!.surgical_suite.amount} horas en ${
                        quote.quote_details!.surgical_suite.category
                      }`
                    : ""
                }
                total={quote.quote_details!.surgical_suite.total_price}
              />
              <FinalQuoteLine
                titulo=" Anestesia"
                detalle={
                  quote.quote_details!.anesthesia.amount
                    ? `${quote.quote_details!.anesthesia.amount} horas en ${quote.quote_details!.anesthesia.category}`
                    : ""
                }
                total={quote.quote_details!.anesthesia.total_price}
              />
              <FinalQuoteLine
                titulo=" Equipo"
                detalle={quote.quote_details!.instruments.selection.join(", ")}
                total={quote.quote_details!.instruments.total_price}
              />
              <FinalQuoteLine
                titulo=" Material quirúrgico"
                detalle={`${quote.quote_details!.qx_material.category}`}
                total={quote.quote_details!.qx_material.total_price}
              />
              <FinalQuoteLine
                titulo=" Medicamentos"
                detalle={`${quote.quote_details!.drugs.category}`}
                total={quote.quote_details!.drugs.total_price}
              />
              <FinalQuoteLine
                titulo=" Laboratorio"
                detalle={quote.quote_details!.laboratories.selection.join(", ")}
                total={quote.quote_details!.laboratories.total_price}
              />
              <FinalQuoteLine
                titulo=" Imagen"
                detalle={quote.quote_details!.imaging.selection.join(", ")}
                total={quote.quote_details!.imaging.total_price}
              />

              <View
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  paddingVertical: "1%",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}> Material y/o equipos a vista</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600" }}>
                      {quote.quote_details!.additional_material.selection.map((x) => x.category).join(", ")}
                    </Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#CC99CC",
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        width: "50%",
                        alignContent: "center",
                        paddingVertical: "4%",
                        marginBottom: "1%",
                      }}
                      onPress={() => setShowMaterialInput(true)}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#FFFFFF" }}>
                          ${quote.quote_details!.additional_material.total_price.toFixed(2)}
                        </Text>
                        <Image
                          style={{ width: "10%", height: "100%", marginRight: "1%" }}
                          source={require("../../assets/chevron.svg")}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <Divider />
              </View>
              <FinalQuoteLine2Columns
                titulo="Precio Lista"
                total={quote.quote_details.subtotal_price + quote.quote_details.additional_material.total_price}
              />
              <FinalQuoteLine2Columns
                titulo="Descuento"
                total={quote.discount < 0 ? quote.discount : quote.discount * -1}
              />
              <FinalQuoteLine2Columns titulo="Subtotal" total={quote.subtotal} />
              {/* <FinalQuoteLine2Columns titulo="Total" total={quote.total} /> */}
              <View style={{ flexDirection: "row", marginLeft: 5 }}>
                <View style={{ flex: 1 }}>
                  <Text></Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>Total</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#CC99CC",
                      paddingHorizontal: 8,
                      borderRadius: 8,
                      width: "50%",
                      alignContent: "flex-end",
                      paddingVertical: "4%",
                      marginBottom: "1%",
                    }}
                    onPress={() => setShowInputTotal(true)}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: "#FFFFFF" }}>{"$" + quote.total.toFixed(2)}</Text>
                      <Image
                        style={{ width: "10%", height: "100%", marginRight: "1%" }}
                        source={require("../../assets/chevron.svg")}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <Divider />
              <View style={{ flexDirection: "row", marginLeft: 5, paddingVertical: "1%" }}>
                <View style={{ flex: 1 }}>
                  <Text></Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>Margen de Contribución</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: `marginColor` }}>{(quote.margin * 100).toFixed(2)} %</Text>
                </View>
              </View>
              <Divider />
            </ScrollView>
            <Stack direction={"row"} style={{ justifyContent: "flex-end", marginTop: "1%" }}>
              {status === QuoteStatus.NEW ? (
                <TouchableOpacity
                  onPress={() => createQuote()}
                  style={{
                    marginLeft: "2%",
                    backgroundColor: "#671E75",
                    paddingHorizontal: "2%",
                    paddingVertical: "1%",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>Crear</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {status === QuoteStatus.EDITED ? (
                <TouchableOpacity
                  onPress={() => updateQuote()}
                  style={{
                    marginLeft: "2%",
                    backgroundColor: "#671E75",
                    paddingHorizontal: "2%",
                    paddingVertical: "1%",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>Actualizar</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {status == QuoteStatus.EDITED ||
              status == QuoteStatus.NEW ||
              (quote.doctor_id !== "" && status === QuoteStatus.FINISHED) ? (
                <TouchableOpacity
                  onPress={() => editQuote()}
                  style={{
                    marginLeft: "2%",
                    backgroundColor: "#671E75",
                    paddingHorizontal: "2%",
                    paddingVertical: "1%",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>Editar</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {quote.doctor_id !== "" && status === QuoteStatus.FINISHED ? (
                <TouchableOpacity
                  style={{
                    marginLeft: "2%",
                    backgroundColor: "#671E75",
                    paddingHorizontal: "2%",
                    paddingVertical: "1%",
                    borderRadius: 4,
                  }}
                  onPress={() => {
                    setOpenPDfDownloader(true);
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>Descargar</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {quote.doctor_id !== "" && status === QuoteStatus.FINISHED ? (
                <TouchableOpacity
                  onPress={() => setShowDuplicateCode(true)}
                  style={{
                    marginLeft: "2%",
                    backgroundColor: "#671E75",
                    paddingHorizontal: "2%",
                    paddingVertical: "1%",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>Duplicar</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {quote.doctor_id !== "" && status === QuoteStatus.FINISHED ? (
                <TouchableOpacity
                  onPress={() => {
                    setTypeAlert(false);
                    setFuncBack(false);
                    setTitleAlert("¿Seguro que quieres regresar?");
                    setMessageAlert("Todos los cambios se perderan.");
                    setShowAlert(true);
                  }}
                  style={{
                    marginLeft: "2%",
                    backgroundColor: "#DD163A",
                    paddingHorizontal: "2%",
                    paddingVertical: "1%",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>Eliminar</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </Stack>
          </View>
        </Stack>
        <FinalQuoteTotalInput
          showModal={showInputTotal}
          onSave={(value: number) => onChangeTotal(value)}
          onCancel={() => setShowInputTotal(false)}
          colors={colors}
          quote={quote}
        />
        <ModalFinalQuoteAdditionalMaterial
          showModal={showMaterialInput}
          onSave={(value: number) => onChangeMaterial(value)}
          onCancel={() => setShowMaterialInput(false)}
          additionalMaterial={quote.quote_details!.additional_material}
        />
        <FinalQuoteDuplicateQuote
          show={showDuplicateCode}
          onSave={(quote: IQuote) => duplicateQuote(quote)}
          onCancel={() => setShowDuplicateCode(false)}
          quote={quote}
        />
        <DownloadQuotePDF
          openModal={openPdfDownloader}
          closeModal={() => setOpenPDfDownloader(false)}
          quote={quote}
          name={context.names}
          email={context.email}
        ></DownloadQuotePDF>
        <AlertDialog
          show={showAlert}
          onCancel={() => setShowAlert(false)}
          title={"" + titleAlert}
          message={"" + messageAlert}
          isSimple={typeAlert}
          onConfirm={funcBack ? () => goBackPage() : () => archiveQuote()}
        />
      </Stack>
      {renderBackdrop()}
    </LinearGradient>
  );

  function renderBackdrop() {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
};
