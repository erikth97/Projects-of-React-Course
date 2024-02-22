import React, { useEffect, useState } from "react";
import { Platform, TextInput, Text, View, TouchableOpacity } from "react-native";
import { Button, Modal, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { v4 as uuidv4 } from "uuid";
// import { IDoctor, IPatient, IQuote } from "../../common/Interfaces";
// import { emptyDoctor, emptyPatient, emptyQuote } from "../../common/emptyObjects";
// import { getDoctors, getHelperData } from "../../common/async_data";
import { emptyDoctor, emptyPatient, emptyQuote, getDoctors, getHelperData, IDoctor, IPatient, IQuote } from "../../common/index"



export const FinalQuoteDuplicateQuote = ({
  show,
  quote,
  onSave,
  onCancel,
}: {
  show: boolean;
  quote: IQuote;
  onSave: (quote: IQuote) => void;
  onCancel: () => void;
}) => {
  const [quoteCopy, setQuoteCopy] = useState<IQuote>(JSON.parse(JSON.stringify(emptyQuote)));
  const [doctors, setDoctors] = useState<Array<IDoctor>>([]);
  const [patients, setPatients] = useState<Array<IPatient>>([]);

  const [selectedPatient, setSelectedPatient] = useState<IPatient>({ ...emptyPatient });
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor>({ ...emptyDoctor });

  const [registerDisabled, setRegisterDisabled] = useState<boolean>(true);
  const registerColor = () => (registerDisabled ? "#DB2777" : "secondary");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const doctors: Array<IDoctor> = await getDoctors();
    setDoctors(doctors);

    const data: { patients: Array<IPatient> } = await getHelperData();
    setPatients(data.patients);
  };

  useEffect(() => {
    const canRegister = selectedPatient.id !== "" && selectedDoctor.id !== "";
    setRegisterDisabled(!canRegister);
  }, [selectedPatient, selectedDoctor]);

  useEffect(() => {
    const q: IQuote = {
      ...quote,
      quote_number: undefined,
      id: undefined,
    };

    setQuoteCopy(q);
  }, [quote]);

  const updateDoctor = (doctor_id: string) => {
    const index = doctors.findIndex((doctor: IDoctor) => doctor.id === doctor_id);
    const doctor: IDoctor = doctors[index];
    const q: IQuote = {
      ...quoteCopy,
      doctor_id,
      doctor,
    };

    setSelectedDoctor(doctor);
    setQuoteCopy(q);
  };

  const updatePatient = (patient_id: string) => {
    const index = patients.findIndex((patient: IPatient) => patient.id === patient_id);
    const patient: IPatient = patients[index];
    const q: IQuote = {
      ...quoteCopy,
      patient_id,
      patient,
    };

    setSelectedPatient(patient);
    setQuoteCopy(q);
  };
  const [paciente, setPacientes] = React.useState("");
  const [doctor, setDoctor] = React.useState("");
  const handleChangePaciente = (event: SelectChangeEvent) => {
    setPacientes(event.target.value as string);
    updatePatient(event.target.value);
  };
  const handleChangeDoctor = (event: SelectChangeEvent) => {
    setDoctor(event.target.value as string);
    updateDoctor(event.target.value);
  };
  return (
    <Modal
      open={show}
      onClose={() => onCancel()}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: "40%",
          width: "25%",
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            marginHorizontal: "5%",
            marginTop: "4%",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#671E75" }}>Duplicar Cotización</Text>
          <TouchableOpacity onPress={() => onCancel()}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <Divider style={{ marginBottom: "4%" }} />
        <View style={{ flexDirection: "row", flex: 1, marginTop: "2%" }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "5%", paddingTop: "1%" }}>
            Paciente
          </Text>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={paciente}
            onChange={handleChangePaciente}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: "25%",
                  maxWidth: "25%",
                },
              },
            }}
            style={{ width: "60%", height: "60%" }}
          >
            {patients.map((item: any) => {
              return (
                <MenuItem key={uuidv4()} value={item.id}>
                  {item.names.toUpperCase() +
                    " " +
                    item.first_surname.toUpperCase() +
                    " " +
                    item.second_surname.toUpperCase()}
                </MenuItem>
              );
            })}
          </Select>
        </View>
        <View style={{ flexDirection: "row", flex: 1, marginBottom: "2%" }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "5%" }}>Médico </Text>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={doctor}
            onChange={handleChangeDoctor}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: "25%",
                },
              },
            }}
            style={{ width: "60%", height: "60%" }}
          >
            {doctors.map((item: any) => {
              return (
                <MenuItem key={uuidv4()} value={item.id}>
                  {item.names.toUpperCase() +
                    " " +
                    item.first_surname.toUpperCase() +
                    " " +
                    item.second_surname.toUpperCase()}
                </MenuItem>
              );
            })}
          </Select>
        </View>
        <Divider />
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginRight: "5%", marginVertical: "2%" }}>
          <Button
            variant="contained"
            disabled={registerDisabled}
            sx={{
              backgroundColor: "#671E75",
              textTransform: "none",
              marginTop: "2%",
              ":hover": {
                bgcolor: "#8f21aa",
              },
            }}
            onClick={() => onSave(quoteCopy)}
          >
            Duplicar
          </Button>
        </View>
      </View>
    </Modal>
  );
};
