import React, { useEffect, useState } from "react";
import { CURRENT_QUOTING_VERSION, GEN_URL } from "../../common/config";
import { IDoctor, IQuote, IPatient, IHospital } from "../../common/Interfaces";
import { SideQuoteInfo } from "../../components/SideQuoteInfo";
import { ROUTES } from "../../common/routes";
import { emptyPatient, emptyQuote } from "../../common/emptyObjects";
import { getHelperData } from "../../common/async_data";
import { TouchableWithoutFeedback, View, TouchableOpacity, Text } from "react-native";
import { QuoteStatus } from "../../common/storage_keys";
import { LinearGradient } from "expo-linear-gradient";
import {
  InputBase,
  TableRow,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { NewQuoteNew } from "../../components/Modals/ModalNewQuote";
import { ModalSelectPatient } from "../../components/Modals/ModalSelectPatient";
import { RegisterPatientNew } from "../../components/Modals/ModalRegisterPatient";
import patientServices from "../../services/patientServices";
import quoteServices from "../../services/quoteServices";

const config = { dependencies: { "linear-gradient": LinearGradient } };

export const QuotesByDoctor = ({ navigation, route }: { navigation: any; route: any }) => {
  const { doctor }: { doctor: IDoctor } = route.params;
  const [doctorState, setDoctorState] = useState<IDoctor>({ ...doctor });

  const [selectedPatient, setSelectedPatient] = useState<IPatient>({ ...emptyPatient });

  const [showModalPatient, setShowPatient] = useState<boolean>(false);
  const [showModalQuote, setShowQuote] = useState<boolean>(false);
  const [showModalSelectPatient, setShowSelectPatient] = useState<boolean>(false);

  const [showBackdrop, setShowBackdrop] = useState<boolean>(true);

  const [patients, setPatients] = useState<Array<IPatient>>([
    {
      id: "",
      names: "",
      first_surname: "",
      second_surname: "",
      birthdate: "",
      gender: "",
      age: 0,
      phone: "",
      email: "",
    },
  ]);
  const [hospitals, setHospitals] = useState<Array<IHospital>>([
    { id: "", display_name: "", dbname: "", address: "", tax: "" },
  ]);

  interface IDataList {
    id: string;
    patient_names: string;
    patient_surname: string;
    doctor_names: string;
    doctor_surname: string;
    mprocedure_name: string;
    update_date: string;
    created_at: string;
    display_name: string;
    quote_number: string;
  }

  const emptyDataList: IDataList = {
    id: "",
    patient_names: "",
    patient_surname: "",
    doctor_names: "",
    doctor_surname: "",
    mprocedure_name: "",
    update_date: "",
    created_at: "",
    display_name: "",
    quote_number: "",
  };
  const [dataList, setDataList] = useState<Array<IDataList>>([{ ...emptyDataList }]);
  const [filteredList, setFilteredList] = useState<Array<IDataList>>([{ ...emptyDataList }]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => getData());
    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    quoteServices.getQuotesByDoctor(doctor.id!).then((data) => {
      setDataList(data);
      setFilteredList(data);
    });

    let data: { hospitals: Array<IHospital>; patients: Array<IPatient> } = await getHelperData();
    setPatients(data.patients);
    setHospitals(data.hospitals);
    setShowBackdrop(false);
  };

  const openModalQuoteWithGeneric = () => {
    const generic_id = "00000000-0000-0000-0000-000000000000";
    const index = patients.findIndex((value) => value.id === generic_id);
    if (index >= 0) setSelectedPatient(patients[index]);
    setShowQuote(true);
  };
  const openModalQuote = () => setShowQuote(true);
  const closeModalQuote = () => setShowQuote(false);

  const openModalPatient = () => setShowPatient(true);
  const closeModalPatient = () => setShowPatient(false);
  const patientSaved = async (patient_id: string) => {
    getData();
    closeModalPatient();
    if (patient_id != "") {
      setSelectedPatient(await patientServices.getPatientByID(patient_id));
    }

    openModalQuote();
  };

  const filterData = (text: string) => {
    if (text !== "") {
      text = text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const filtered: Array<IDataList> = dataList.filter((item: IDataList) => {
        let lookup =
          `${item.doctor_names} ${item.doctor_surname} ${item.patient_names} ${item.patient_surname} ${item.mprocedure_name} ${item.update_date}`
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        return lookup.includes(text);
      });
      setFilteredList(filtered);
    } else {
      setFilteredList(dataList);
    }
  };

  const editQuote = ({
    selectedHospital,
    selectedPatient,
    selectedProcedure,
  }: {
    selectedHospital: IHospital;
    selectedPatient: IPatient;
    selectedProcedure: string;
  }) => {
    const emptyQuote2: IQuote = JSON.parse(JSON.stringify(emptyQuote));
    closeModalQuote();
    const q: IQuote = {
      ...emptyQuote2,
      version: CURRENT_QUOTING_VERSION,
      patient: selectedPatient,
      patient_id: selectedPatient.id || "",
      patient_names: selectedPatient.names,
      hospital: selectedHospital,
      hospital_id: selectedHospital.id,
      mprocedure_name: selectedProcedure,
      doctor: doctorState,
      doctor_id: doctorState.id || "",
      doctor_names: doctorState.names,
    };

    navigation.push(ROUTES.EDIT_QUOTE, {
      isEdit: false,
      quote: q,
      source: ROUTES.DOCTOR_QUOTES,
    });
  };

  return (
    <LinearGradient colors={["#671E75", "#A12CB8"]} style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ flex: 1 }}>
        <SideQuoteInfo doctor={doctorState} />
      </View>
      <View
        style={{
          flex: 4,
          backgroundColor: "#FFFFFF",
          height: "95%",
          borderRadius: 10,
          flexDirection: "column",
          marginRight: "3%",
        }}
      >
        <View
          style={{
            alignSelf: "center",
            flexDirection: "row",
            borderRadius: 5,
            flex: 1,
            width: "97%",
            backgroundColor: "#EEEEEE",
            marginTop: "2%",
          }}
        >
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <SearchIcon sx={{ scale: 2, marginLeft: 2, marginRight: 1, color: "#9E9E9E" }}></SearchIcon>
          </View>
          <InputBase
            sx={{ width: "94%" }}
            placeholder="Filtrar"
            inputProps={{ "aria-label": "search google maps" }}
            onChange={(v) => filterData(v.target.value)}
          />
        </View>
        <TableContainer sx={{ flex: 8, marginTop: "2%", width: "98%", alignSelf: "center", marginLeft: "2%" }}>
          <Table aria-label="simple table" stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Paciente</TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Procedimiento</TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Hospital</TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Última Actualización</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredList.map((item) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate(ROUTES.QUOTE_SUMMARY, {
                      quote: { ...emptyQuote, quote_number: item.quote_number },
                      source: ROUTES.DOCTOR_QUOTES,
                      status: QuoteStatus.FINISHED,
                    })
                  }
                >
                  <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover>
                    <TableCell>{item.patient_names + " " + item.patient_surname}</TableCell>
                    <TableCell>{item.mprocedure_name}</TableCell>
                    <TableCell>{item.display_name}</TableCell>
                    <TableCell>{item.update_date}</TableCell>
                  </TableRow>
                </TouchableWithoutFeedback>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <View
          style={{
            marginRight: "3%",
            marginVertical: "2%",
            flex: 3,
          }}
        >
          <View style={{ alignItems: "flex-end" }}>
            <View>
              <TouchableOpacity
                onPress={() => openModalQuote()}
                style={{
                  backgroundColor: "#671E75",
                  padding: 8,
                  borderRadius: 3,
                  marginBottom: 3,
                }}
              >
                <Text style={{ color: "#FFFFFF" }}>Agregar cotización</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "flex-end", paddingTop: 6 }}>
              <Text style={{ fontSize: 12 }}>¿No encuentra el paciente que busca?</Text>

              <TouchableOpacity onPress={() => openModalPatient()}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 12,
                    textDecorationLine: "underline",
                    paddingTop: 3,
                  }}
                >
                  Registre un nuevo paciente
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "flex-end", paddingTop: 4 }}>
              <TouchableOpacity onPress={() => openModalQuoteWithGeneric()}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 12,
                    textDecorationLine: "underline",
                    paddingTop: 3,
                  }}
                >
                  Cotizar sin paciente
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <NewQuoteNew
        showModal={showModalQuote}
        closeModal={() => closeModalQuote()}
        editQuote={editQuote}
        selectedPatient={selectedPatient}
        openSelectPatient={() => setShowSelectPatient(true)}
        hospitals={hospitals}
      />
      <ModalSelectPatient
        showModal={showModalSelectPatient}
        onClose={() => setShowSelectPatient(false)}
        patients={patients}
        setSelectedPatient={(patient: IPatient) => setSelectedPatient(patient)}
      />
      <RegisterPatientNew
        showModal={showModalPatient}
        onClose={() => closeModalPatient()}
        onSave={(patient_id: string) => patientSaved(patient_id)}
      />
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
