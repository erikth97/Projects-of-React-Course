import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ICostsCategoryFixed,
  ICostsCategoryFixedVariable,
  ICostsHospital,
  IMultipleCategories,
  IMultipleCategoriesVariable,
  IQuote,
  IQuoteDetails,
  ISingleCategory,
  ISingleVariableCategory,
} from "../../common/Interfaces";
import { CustomCompoundAccordionField } from "../../components/CustomCompoundAccordionField";
import { emptyCosts, emptyCostsCategoryFixed } from "../../common/emptyObjects";
import { DEFAULT_COSTS_ADDITIONAL_MATERIAL_MARGIN } from "../../common/config";
import { getAllCostsByHospitalId } from "../../services/costServices";
import { CurrencyFormatter } from "../../common/functions";
import { View } from "react-native";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LinearGradient } from "expo-linear-gradient";
import { CustomCheckBoxComponent } from "../../components/CustomCheckBoxComponent";
import { CustomAccordionField } from "../../components/CustomAccordionField";
import { v4 as uuidv4 } from "uuid";
import { ROUTES } from "../../common/routes";
import { QuoteStatus } from "../../common/storage_keys";
import { AlertDialog } from "../../components/Modals/ModalAlert";
import { SideQuoteInfo } from "../../components/SideQuoteInfo";

export const EditQuote = ({ navigation, route }: { navigation: any; route: any }) => {
  const isFocused = useIsFocused();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [emptyFields, setEmptyFields] = useState<String>("");

  const { quote, source, isEdit = false }: { quote: IQuote; source: string; isEdit: boolean } = route.params;
  const [quoteDetails, setQuoteDetails] = useState<IQuoteDetails>(route.params.quote.quote_details);

  const [costs, setCosts] = useState<ICostsHospital>(emptyCosts);
  const [costsWasLoaded, setCostsWasLoaded] = useState<boolean>(false);

  //Form
  const [instrumentOptions, setInstrumentOptions] = useState<Array<ICostsCategoryFixed>>([emptyCostsCategoryFixed]);
  const [selectedInstruments, setSelectedInstruments] = useState<Array<ICostsCategoryFixed>>([]);

  const [laboratoryOptions, setLaboratoryOptions] = useState<Array<ICostsCategoryFixed>>([emptyCostsCategoryFixed]);
  const [selectedLaboratories, setSelectedLaboratories] = useState<Array<ICostsCategoryFixed>>([]);

  const [imagingOptions, setImagingOptions] = useState<Array<ICostsCategoryFixed>>([emptyCostsCategoryFixed]);
  const [selectedImaging, setSelectedImaging] = useState<Array<ICostsCategoryFixed>>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [titleAlert, setTitleAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");

  useEffect(() => {
    if (isFocused) _getCosts();
  }, [isFocused]);

  const _getCosts = async () => {
    const c: ICostsHospital = await getAllCostsByHospitalId(quote.hospital_id);
    setCosts(c);
    if (c.instruments.length >= 1) setInstrumentOptions(c.instruments[0].types);
    if (c.laboratories.length >= 1) setLaboratoryOptions(c.laboratories);
    if (c.imaging.length >= 1) setImagingOptions(c.imaging);

    setCostsWasLoaded(true);
  };

  const updateDetails = (quoteDetails: IQuoteDetails, update: boolean = true): IQuoteDetails => {
    let details = { ...quoteDetails };

    details.total_cost = 0;
    details.subtotal_price = 0;

    for (const [key, value] of Object.entries(quoteDetails)) {
      if (value.total_cost && value.total_price && key !== "additional_material") {
        details.total_cost = details.total_cost + value.total_cost;
        details.subtotal_price = details.subtotal_price + value.total_price;
      }
    }

    if (update) setQuoteDetails(details);

    return details;
  };

  const updateRoom = ({
    newRoom,
    days,
  }: {
    newRoom?: ICostsCategoryFixedVariable | ISingleVariableCategory;
    days?: number;
  }) => {
    if (!days || days < 0) days = quoteDetails.room.amount;

    if (!newRoom) newRoom = quoteDetails.room;

    let selectedRoom: ICostsCategoryFixedVariable = {
      category: "",
      description: "",
      variable_cost: 0,
      variable_price: 0,
      fixed_cost: 0,
      fixed_price: 0,
    };

    if ("amount" in newRoom) {
      const currentRoom = costs.room.find((a) => a.category === newRoom!.category);
      if (currentRoom !== undefined) selectedRoom = currentRoom;
    } else {
      selectedRoom = newRoom;
    }

    const room: ISingleVariableCategory = {
      amount: days,
      category: newRoom.category,
      total_cost: selectedRoom.variable_cost * days + selectedRoom.fixed_cost * Number(days > 0),
      total_price: selectedRoom.variable_price * days + selectedRoom.fixed_price * Number(days > 0),
    };

    updateDetails({ ...quoteDetails, room });
  };

  const updateSurgicalSuite = ({
    newSurgicalSuite,
    hours,
  }: {
    newSurgicalSuite?: ICostsCategoryFixedVariable | ISingleVariableCategory;
    hours?: number;
  }) => {
    if (!hours || hours < 0) hours = quoteDetails.surgical_suite.amount;

    if (!newSurgicalSuite) newSurgicalSuite = quoteDetails.surgical_suite;

    let selectedSuite: ICostsCategoryFixedVariable = {
      category: "",
      description: "",
      variable_cost: 0,
      variable_price: 0,
      fixed_cost: 0,
      fixed_price: 0,
    };

    if ("amount" in newSurgicalSuite) {
      const currentSurgicalSuite = costs.surgical_suite.find((a) => a.category === newSurgicalSuite!.category);
      if (currentSurgicalSuite !== undefined) selectedSuite = currentSurgicalSuite;
    } else {
      selectedSuite = newSurgicalSuite;
    }

    const surgical_suite: ISingleVariableCategory = {
      amount: hours,
      category: selectedSuite.category,
      total_cost: selectedSuite.variable_cost * hours + selectedSuite.fixed_cost * Number(hours > 0),
      total_price: selectedSuite.variable_price * hours + selectedSuite.fixed_price * Number(hours > 0),
    };

    const details = updateDetails({ ...quoteDetails, surgical_suite });

    const currentAnesthesia = costs.anesthesia.find((a) => a.category === details.anesthesia.category);

    updateAnesthesia({ hours, newAnesthesia: currentAnesthesia, details });
  };

  const updateAnesthesia = ({
    hours,
    newAnesthesia,
    details,
  }: {
    hours?: number;
    newAnesthesia?: ICostsCategoryFixedVariable;
    details?: IQuoteDetails;
  }) => {
    if (!hours || hours < 0) hours = quoteDetails.surgical_suite.amount;

    if (!details) details = { ...quoteDetails };

    if (newAnesthesia === null || newAnesthesia === undefined) {
      updateDetails(details);
      return;
    }

    const anesthesia: ISingleVariableCategory = {
      amount: hours,
      category: newAnesthesia.category,
      total_cost:
        newAnesthesia.variable_cost *
        (hours - (newAnesthesia.conditional_hours || 0)) *
        Number(hours > (newAnesthesia.conditional_hours || 0)) +
        newAnesthesia.fixed_cost * Number(hours > 0),
      total_price:
        newAnesthesia.variable_price *
        (hours - (newAnesthesia.conditional_hours || 0)) *
        Number(hours > (newAnesthesia.conditional_hours || 0)) +
        newAnesthesia.fixed_price * Number(hours > 0),
    };

    updateDetails({ ...details, anesthesia });
  };

  const updateInstruments = (selection: string) => {
    // Obtenemos la seleccionada
    const selected: ICostsCategoryFixed | undefined = instrumentOptions.find(
      (item: ICostsCategoryFixed) => item.category == selection
    );

    let allSelectedInstruments: Array<ICostsCategoryFixed> = [];

    let instruments: IMultipleCategories = { selection: [], total_cost: 0, total_price: 0 };

    let fixedCost = 0;

    let fixedPrice = 0;

    if (selected != undefined) {
      if (selectedInstruments.includes(selected)) {
        allSelectedInstruments = selectedInstruments.filter(
          (instrument: ICostsCategoryFixed) => instrument !== selected
        );
        setSelectedInstruments(
          selectedInstruments.filter((instrument: ICostsCategoryFixed) => instrument !== selected)
        );
      } else {
        allSelectedInstruments = [...selectedInstruments, selected];
        setSelectedInstruments([...selectedInstruments, selected]);
      }

      if (allSelectedInstruments.length > 0) {
        if (costs.instruments.length >= 1) {
          fixedCost = costs.instruments[0].fixed_cost;
          fixedPrice = costs.instruments[0].fixed_price;
        }

        instruments.selection = allSelectedInstruments.map((x) => x.category);
        instruments.total_cost = allSelectedInstruments.reduce(
          (agg: number, curr: ICostsCategoryFixed) => agg + curr.fixed_cost,
          fixedCost
        );
        instruments.total_price = allSelectedInstruments.reduce(
          (agg: number, curr: ICostsCategoryFixed) => agg + curr.fixed_price,
          fixedPrice
        );
      }
    }

    updateDetails({ ...quoteDetails, instruments });
  };

  const updateQxMaterial = (selected: ICostsCategoryFixed) => {
    let qx_material: ISingleCategory = { category: "", total_cost: 0, total_price: 0 };
    if (selected) {
      qx_material = {
        category: selected.category,
        total_cost: selected.fixed_cost,
        total_price: selected.fixed_price,
      };
    }
    updateDetails({ ...quoteDetails, qx_material });
  };

  const updateDrugs = (selected: ICostsCategoryFixed) => {
    let drugs: ISingleCategory = { category: "", total_cost: 0, total_price: 0 };
    if (selected) {
      drugs = {
        category: selected.category,
        total_cost: selected.fixed_cost,
        total_price: selected.fixed_price,
      };
    }
    updateDetails({ ...quoteDetails, drugs });
  };

  const updateLaboratories = (selection: string) => {
    const selected: ICostsCategoryFixed | undefined = laboratoryOptions.find(
      (item: ICostsCategoryFixed) => item.category === selection
    );

    let allSelectedLaboratories: Array<ICostsCategoryFixed> = [];

    let laboratories: IMultipleCategories = { selection: [], total_cost: 0, total_price: 0 };

    let fixedCost = 0;

    let fixedPrice = 0;

    if (selected != undefined) {
      if (selectedLaboratories.includes(selected)) {
        allSelectedLaboratories = selectedLaboratories.filter(
          (laboratory: ICostsCategoryFixed) => laboratory !== selected
        );
        setSelectedLaboratories(allSelectedLaboratories);
      } else {
        allSelectedLaboratories = [...selectedLaboratories, selected];
        setSelectedLaboratories(allSelectedLaboratories);
      }

      if (allSelectedLaboratories.length > 0) {
        if (costs.laboratories.length >= 1) {
          fixedCost = costs.laboratories[0].fixed_cost;
          fixedPrice = costs.laboratories[0].fixed_price;
        }
        laboratories.selection = allSelectedLaboratories.map((x) => x.category);
        laboratories.total_cost = allSelectedLaboratories.reduce(
          (agg: number, curr: ICostsCategoryFixed) => agg + curr.fixed_cost,
          fixedCost
        );
        laboratories.total_price = allSelectedLaboratories.reduce(
          (agg: number, curr: ICostsCategoryFixed) => agg + curr.fixed_price,
          fixedPrice
        );
      }
    }

    updateDetails({ ...quoteDetails, laboratories });
  };

  const updateImaging = (selection: string) => {
    const selected: ICostsCategoryFixed | undefined = imagingOptions.find(
      (item: ICostsCategoryFixed) => item.category === selection
    );

    let allSelectedImaging: Array<ICostsCategoryFixed> = [];

    let imaging: IMultipleCategories = { selection: [], total_cost: 0, total_price: 0 };

    if (selected != undefined) {
      if (selectedImaging.includes(selected)) {
        allSelectedImaging = selectedImaging.filter((imaging: ICostsCategoryFixed) => imaging !== selected);
        setSelectedImaging(allSelectedImaging);
      } else {
        allSelectedImaging = [...selectedImaging, selected];
        setSelectedImaging(allSelectedImaging);
      }

      if (allSelectedImaging.length > 0) {
        imaging.selection = allSelectedImaging.map((x) => x.category);
        imaging.total_cost = allSelectedImaging.reduce(
          (agg: number, curr: ICostsCategoryFixed) => agg + curr.fixed_cost,
          0
        );
        imaging.total_price = allSelectedImaging.reduce(
          (agg: number, curr: ICostsCategoryFixed) => agg + curr.fixed_price,
          0
        );
      }
    }
    updateDetails({ ...quoteDetails, imaging });
  };

  const addAdditionalMaterial = () => {
    const additional_material: IMultipleCategoriesVariable = { ...quoteDetails.additional_material };

    additional_material.selection.push({
      id: (Math.random() * 100000000).toFixed(0),
      category: "",
      total_cost: 0,
      total_price: 0,
    });

    updateDetails({ ...quoteDetails, additional_material });
  };

  const updateAdditionalMaterialDescription = (id: string, name: string) => {
    const additional_material: IMultipleCategoriesVariable = { ...quoteDetails.additional_material };
    additional_material.selection = [...quoteDetails.additional_material.selection];
    let index = additional_material.selection.findIndex((value) => value.id === id);
    additional_material.selection[index].category = name;

    updateDetails({ ...quoteDetails, additional_material });
  };

  const updateAdditionalMaterialFactor = (id: string, amount: string) => {
    const additional_material: IMultipleCategoriesVariable = { ...quoteDetails.additional_material };

    const amountInt = !Number.isNaN(parseInt(amount)) ? parseInt(amount) : 0;

    additional_material.selection = [...quoteDetails.additional_material.selection];
    const index = additional_material.selection.findIndex((value) => value.id === id);
    additional_material.selection[index].total_cost = amountInt;
    additional_material.selection[index].total_price = amountInt;
    additional_material.total_cost = additional_material.selection.reduce((agg, curr) => agg + curr.total_cost, 0);
    // additional_material.total_price = additional_material.total_cost / (1 - additional_material.margin);
    additional_material.margin = DEFAULT_COSTS_ADDITIONAL_MATERIAL_MARGIN;
    //additional_material.total_price = additional_material.total_cost + additional_material.total_cost * additional_material.margin;
    additional_material.total_price = additional_material.total_cost * additional_material.margin;

    updateDetails({ ...quoteDetails, additional_material });
  };

  const removeAdditionalMaterial = (id: string) => {
    const additional_material: IMultipleCategoriesVariable = { ...quoteDetails.additional_material };
    additional_material.selection = [...quoteDetails.additional_material.selection];
    const index = additional_material.selection.findIndex((value) => value.id === id);
    additional_material.selection.splice(index, 1);
    additional_material.total_cost = additional_material.selection.reduce((agg, curr) => agg + curr.total_cost, 0);
    // additional_material.total_price = additional_material.total_cost / (1 - additional_material.margin);
    additional_material.total_price =
      additional_material.total_cost + additional_material.total_cost * additional_material.margin;

    updateDetails({ ...quoteDetails, additional_material });
  };

  const continueQuote = () => {
    setModalIsOpen(false);

    const q: IQuote = {
      ...quote,
      details_json: JSON.stringify(quoteDetails),
      quote_details: quoteDetails,
    };

    navigation.setParams({ quote: q });
    navigation.navigate(ROUTES.QUOTE_SUMMARY, {
      quote: q,
      source,
      status: isEdit ? QuoteStatus.EDITED : QuoteStatus.NEW,
    });
  };

  const validateForm = () => {
    let empty = [];

    if (quoteDetails.room.total_price === 0) {
      empty.push("Estancia");
    }
    if (quoteDetails.surgical_suite.total_price === 0) {
      empty.push("Sala");
    }
    if (quoteDetails.anesthesia.total_price === 0) {
      empty.push("Anestesia");
    }
    if (quoteDetails.instruments.total_price === 0) {
      empty.push("Equipo");
    }
    if (quoteDetails.qx_material.total_price === 0) {
      empty.push("Material Quirúrgico");
    }
    if (quoteDetails.drugs.total_price === 0) {
      empty.push("Medicamentos");
    }
    if (quoteDetails.laboratories.total_price === 0) {
      empty.push("Laboratorios");
    }
    if (quoteDetails.imaging.total_price === 0) {
      empty.push("Imagen");
    }
    if (quoteDetails.additional_material.total_price === 0) {
      empty.push("Material y/o equipos a vista");
    }

    let emptyAsString = empty.join(", ");

    if (empty.length > 0) {
      setShowAlert(true);
      setEmptyFields(emptyAsString);
    } else {
      continueQuote();
    }
  };
  return (
    <LinearGradient colors={["#671E75", "#A12CB8"]} style={{ minHeight: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          //paddingX: 5,
          flexDirection: "row",
        }}
      >
        <Box sx={{ flex: 3 }}>
          <SideQuoteInfo
            quote_number={quote.quote_number || ""}
            doctor={quote.doctor!}
            patient={quote.patient}
            procedure={quote.mprocedure_name}
            hospital={quote.hospital}
            total={CurrencyFormatter.format(quoteDetails.subtotal_price)}
          />
        </Box>
        <Box sx={{ flex: 7 }}>
          <Box
            sx={{
              background: "white",
              borderRadius: 3,
              paddingX: 5,
              paddingY: 2,
              marginRight: "4%",
            }}
          >
            {renderRoom()}
            {renderSurgicalSuite()}
            {renderAnesthesia()}
            {renderInstrumental()}
            {renderQxMaterial()}
            {renderDrugs()}
            {renderLaboratories()}
            {renderImaging()}
            {renderAdditionalMaterial()}
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>{renderContinueButton()}</View>
          </Box>
        </Box>
        {renderBackdrop()}
      </Box>
      <AlertDialog
        show={showAlert}
        onCancel={() => setShowAlert(false)}
        title={"¿Deseas continuar? \nLos siguientes campos están vacíos:"}
        message={"" + emptyFields}
        isSimple={false}
        onConfirm={() => {
          continueQuote();
          setShowAlert(false);
        }}
      />
    </LinearGradient>
  );

  function renderBackdrop() {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 10 }} open={!costsWasLoaded}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  function renderRoom() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: "bold" }}>Estancia</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {CurrencyFormatter.format(quoteDetails.room.total_price)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {costsWasLoaded && (
            <CustomCompoundAccordionField
              firstFieldTitle="Cuarto"
              firstDefaultValue={costs.room.find((x) => x.category == quoteDetails.room.category)?.description || ""}
              secondFieldTitle="Días"
              secondDefaultValue={quoteDetails.room.amount}
              isEditable={true}
              onChangeFirstField={(type) => updateRoom({ newRoom: type })}
              onChangeSecondField={(value) => updateRoom({ days: value })}
              items={costs.room}
            />
          )}
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderSurgicalSuite() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: "bold" }}>Sala</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {CurrencyFormatter.format(quoteDetails.surgical_suite.total_price)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {costsWasLoaded && (
            <CustomCompoundAccordionField
              firstFieldTitle="Sala"
              firstDefaultValue={
                costs.surgical_suite.find((item) => item.category == quoteDetails.surgical_suite.category)
                  ?.description || ""
              }
              secondFieldTitle="Horas"
              secondDefaultValue={quoteDetails.surgical_suite.amount}
              isEditable={true}
              onChangeFirstField={(type) => updateSurgicalSuite({ newSurgicalSuite: type })}
              onChangeSecondField={(value) => updateSurgicalSuite({ hours: value })}
              items={costs.surgical_suite}
            />
          )}
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderAnesthesia() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3bh-content" id="panel3bh-header">
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: "bold" }}>Anestesia</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {CurrencyFormatter.format(quoteDetails.anesthesia.total_price)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {costsWasLoaded && (
            <CustomCompoundAccordionField
              key={quoteDetails.surgical_suite.amount}
              firstFieldTitle="Anestesia"
              firstDefaultValue={
                costs.anesthesia.find((item) => item.category == quoteDetails.anesthesia.category)?.description || ""
              }
              secondFieldTitle="Horas"
              secondDefaultValue={quoteDetails.surgical_suite.amount}
              isEditable={false}
              onChangeFirstField={(type) => updateAnesthesia({ newAnesthesia: type })}
              items={costs.anesthesia}
            />
          )}
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderInstrumental() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: "bold" }}>Equipo</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {CurrencyFormatter.format(quoteDetails.instruments.total_price)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {costsWasLoaded && (
            <CustomCheckBoxComponent
              items={instrumentOptions}
              values={quoteDetails.instruments.selection}
              onChange={(selected: string) => updateInstruments(selected)}
            />
          )}
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderQxMaterial() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: "bold" }}>Material quirúrgico</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {CurrencyFormatter.format(quoteDetails.qx_material.total_price)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {costsWasLoaded && (
            <CustomAccordionField
              fieldTitle="Categoría"
              defaultValue={
                costs.qx_material.find((item) => item.category === quoteDetails.qx_material.category)?.description || ""
              }
              concept="Material quirúrgico"
              items={costs.qx_material}
              onChange={(selected) => updateQxMaterial(selected)}
            ></CustomAccordionField>
          )}
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderDrugs() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: "bold" }}>Medicamentos</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {CurrencyFormatter.format(quoteDetails.drugs.total_price)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {costsWasLoaded && (
            <CustomAccordionField
              fieldTitle="Categoría"
              concept=""
              defaultValue={
                costs.drugs.find((item) => item.category === quoteDetails.drugs.category)?.description || ""
              }
              items={costs.drugs}
              onChange={(selected) => updateDrugs(selected)}
            ></CustomAccordionField>
          )}
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderLaboratories() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: "bold" }}>Laboratorio</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {CurrencyFormatter.format(quoteDetails.laboratories.total_price)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {costsWasLoaded && (
            <CustomCheckBoxComponent
              items={laboratoryOptions}
              values={quoteDetails.laboratories.selection}
              onChange={(selection: string) => updateLaboratories(selection)}
            ></CustomCheckBoxComponent>
          )}
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderImaging() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: "bold" }}>Imagen</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {CurrencyFormatter.format(quoteDetails.imaging.total_price)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {costsWasLoaded && (
            <CustomCheckBoxComponent
              items={imagingOptions}
              values={quoteDetails.imaging.selection}
              onChange={(selection: string) => updateImaging(selection)}
            />
          )}
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderAdditionalMaterial() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: "bold" }}>Material y/o equipos a vista</Typography>
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Aplica en caso de trato directo</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {CurrencyFormatter.format(
              quoteDetails.additional_material.total_cost * DEFAULT_COSTS_ADDITIONAL_MATERIAL_MARGIN
            )}{" "}
            (MARKUP)
          </Typography>
        </AccordionSummary>
        <AccordionDetails key={quoteDetails.additional_material.selection.length}>
          <Box key={quoteDetails.additional_material.selection.length} display={"flex"} flexDirection={"column"}>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} marginY={2}>
              <Typography>Agregar Material Adicional</Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#470a68",
                  ":hover": {
                    backgroundColor: "#37104c",
                  },
                }}
                onClick={() => addAdditionalMaterial()}
              >
                Añadir otro
              </Button>
            </Box>
            {quoteDetails.additional_material.selection.map((additional_material) => {
              return (
                <Box key={uuidv4()} display={"flex"} flexDirection={"row"} sx={{ marginBottom: "2%" }}>
                  <TextField
                    variant="outlined"
                    placeholder={"Descripción"}
                    defaultValue={additional_material.category}
                    color="secondary"
                    onBlur={(event) =>
                      updateAdditionalMaterialDescription(additional_material.id || "", event.target.value)
                    }
                  ></TextField>
                  <TextField
                    variant="outlined"
                    placeholder={"0.00"}
                    color="secondary"
                    style={{
                      marginRight: "2%",
                      marginLeft: "2%",
                    }}
                    InputProps={{
                      inputProps: { min: 0 },
                      inputMode: "numeric",
                    }}
                    defaultValue={
                      additional_material.total_cost.toFixed(2) === "0.00"
                        ? undefined
                        : additional_material.total_cost.toFixed(2)
                    }
                    onBlur={(event) => updateAdditionalMaterialFactor(additional_material.id || "", event.target.value)}
                  ></TextField>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#DD163A",
                      ":hover": {
                        backgroundColor: "#c30D32",
                      },
                    }}
                    onBlur={() => removeAdditionalMaterial(additional_material.id || "")}
                  >
                    Eliminar
                  </Button>
                </Box>
              );
            })}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderContinueButton() {
    return (
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#470a68",
          ":hover": {
            backgroundColor: "#37104c",
          },
          marginTop: 3,
        }}
        onClick={validateForm}
      >
        Continuar
      </Button>
    );
  }
};
