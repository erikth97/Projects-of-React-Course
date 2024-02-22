import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, MenuItem, Modal, Select, Input, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import { IHospital, IPatient } from "../../common/Interfaces";
// import { emptyHospital } from "../../common/emptyObjects";
// import { patientDisplayName } from "../../common/functions";
import { IHospital, IPatient, emptyHospital, patientDisplayName } from "../../common/index"

export const NewQuoteNew = ({
  showModal,
  hospitals,
  selectedPatient,
  closeModal,
  openSelectPatient,
  editQuote,
}: {
  showModal: boolean;
  hospitals: Array<IHospital>;
  selectedPatient: IPatient;
  closeModal: () => void;
  openSelectPatient: () => void;
  editQuote: ({
    selectedHospital,
    selectedPatient,
    selectedProcedure,
  }: {
    selectedHospital: IHospital;
    selectedPatient: IPatient;
    selectedProcedure: string;
  }) => void;
}) => {
  const [selectedHospital, setSelectedHospital] = useState<IHospital>({ ...emptyHospital });
  const [selectedProcedure, setSelectedProcedure] = useState<string>("");

  const [registerDisabled, setRegisterDisabled] = useState<boolean>(true);
  const registerColor = () => (registerDisabled ? "light" : "secondary");

  useEffect(() => {
    const canRegister = selectedHospital.id !== "" && selectedProcedure.length !== 0 && selectedPatient.id !== "";

    setRegisterDisabled(!canRegister);
  }, [selectedHospital, setSelectedHospital, selectedPatient, setSelectedProcedure, selectedProcedure]);

  const changeSelectedHospital = (hospital_id: string) => {
    const index = hospitals.findIndex((value) => value.id === hospital_id);
    if (index >= 0) setSelectedHospital(hospitals[index]);
  };

  const close = () => {
    closeModal();
    //clean inputs from modal
    selectedPatient.id = "";
    setSelectedProcedure("");
    setSelectedHospital({ ...emptyHospital });
  };
  const buttonPatient = {
    ":hover": {
      bgcolor: "#671E75",
    },
    borderRadius: 1,
    borderWidth: 0,
    backgroundColor: "#9D58AA",
    width: "100%",
    height: "70%",
    flex: 1,
    marginBottom: "2%",
  };
  const intputProcedure = {
    flex: 1,
    borderRadius: 1,
    marginBottom: "2%",
    maxHeight: "50px",
    backgroundColor: "rgb(240, 240, 240)",
    paddingLeft: "2%",
    paddingY: "3%",
  };
  const buttonRegister = {
    ":hover": {
      bgcolor: "#9D58AA",
    },
    borderRadius: 1,
    borderWidth: 0,
    backgroundColor: "#671E75",
    width: "40%",
    paddingX: "2%",
    textTransform: "none",
  };
  const selected = {
    maxHeight: 100,
  };
  return (
    <Modal
      open={showModal}
      onClose={() => close()}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nueva cotización</Text>
          <IconButton onClick={close} style={{ marginTop: "-2%" }}>
            <CloseIcon />
          </IconButton>
        </View>
        <Text style={styles.text}>Paciente:</Text>
        <Button onClick={() => openSelectPatient()} sx={buttonPatient}>
          <Text style={{ color: "white" }}>
            {selectedPatient.id == "" ? "Seleccionar Paciente" : patientDisplayName(selectedPatient)}
          </Text>
        </Button>
        <Text style={styles.text}>Procedimiento:</Text>
        <Input
          disableUnderline={true}
          fullWidth={true}
          onChange={(text) => setSelectedProcedure(text.target.value)}
          sx={intputProcedure}
        />
        <Text style={styles.text}>Hospital:</Text>
        <Select
          disableUnderline={true}
          value={selectedHospital.id}
          onChange={(hospital_id) => changeSelectedHospital(hospital_id.target.value)}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: "25%",
              },
            },
          }}
          sx={{
            borderRadius: 1,
            maxHeight: "50px",
            backgroundColor: "rgb(240,240,240)",
            "& fieldset": {
              border: "none",
            },
          }}
        >
          {hospitals.map((item) => (
            <MenuItem value={item.id}>{item.display_name}</MenuItem>
          ))}
        </Select>
        <View style={styles.containerButton}>
          <Button
            variant="contained"
            sx={buttonRegister}
            disabled={registerDisabled}
            onClick={() => editQuote({ selectedHospital, selectedPatient, selectedProcedure })}
          >
            Continuar
          </Button>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "25%",
    maxHeight: 500,
    height: "70%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingTop: "2%",
    paddingLeft: "2%",
    paddingRight: "2%",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "5%",
  },
  title: {
    color: "#671E75",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: "5%",
  },
  containerButton: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "flex-end",
    marginBottom: "4%",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: "3%",
  },
});
