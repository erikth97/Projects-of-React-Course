import React, { useState, useRef, useEffect, MutableRefObject } from "react";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import { Stack, Modal, MenuItem, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { Dayjs } from "dayjs";
import { AlertDialog } from "./ModalAlert";
import patientServices from "../../services/patientServices";
// import { IPatient } from "../../common/Interfaces";
// import { emptyPatient } from "../../common/emptyObjects";
import { IPatient, emptyPatient } from "../../common/index"

export const RegisterPatientNew = ({
  showModal,
  onClose,
  onSave,
}: {
  showModal: boolean;
  onClose: () => void;
  onSave: (id: string) => void;
}) => {
  const today = new Date();

  const firstSurnameInput = useRef() as MutableRefObject<HTMLDivElement>;
  const secondSurnameInput = useRef() as MutableRefObject<HTMLDivElement>;
  const emailInput = useRef() as MutableRefObject<HTMLDivElement>;

  const [patient, setPatient] = useState<IPatient>({ ...emptyPatient });
  const [birthdate, setBirthdate] = useState<Date>(today);

  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(true);

  const [registerDisabled, setRegisterDisabled] = useState<boolean>(true);
  const registerColor = () => (registerDisabled ? "light" : "#671E75");

  //validate errors in forms
  const [errors, setErrors] = useState<string>("");

  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [cleared, setCleared] = React.useState<boolean>(false);
  const [genero, setGenero] = React.useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [titleAlert, setTitleAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [funtionAlert, setFuntionAlert] = useState<Function>(() => { });

  const handleChange = (event: SelectChangeEvent) => {
    setGenero(event.target.value as string);
  };
  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
    return () => { };
  }, [cleared]);

  /*
  useEffect(() => {
    const canRegister = (patient.names !== "" && patient.first_surname !== "" && patient.email != "" && patient.age >= 0 && birthdate !== today);
    setRegisterDisabled(!canRegister);
  }, [patient]);


  const showDatePicker = () => {
    setDatePickerVisibility(true);
    Keyboard.dismiss();
  };*/

  const changeBirthdate = (date: Date) => {
    const seconds = (today.getTime() - date.getTime()) / 1000;
    const hours = seconds / (60 * 60);
    const days = hours / 24;
    const years = days / 365;

    setBirthdate(date);
    setPatient({
      ...patient,
      age: Math.floor(years),
      birthdate: date.toISOString().substring(0, 10),
    });
    setDatePickerVisibility(false);
  };

  useEffect(() => {
    const canRegister =
      patient.names.length !== 0 &&
      patient.first_surname.length !== 0 &&
      patient.birthdate.length !== 0 &&
      patient.email.length !== 0;
    setRegisterDisabled(!canRegister);
  }, [patient, setPatient]);

  const clearPatient = () => {
    //if inpyt required are empty send an alert "Patient is empty, please fill the required data"
    //let cleanForm =  (document.getElementById("inputPatient") as HTMLFormElement).value;
    //if (form) (form as HTMLFormElement).reset();
    setPatient({
      ...patient,
      names: "",
      first_surname: "",
      second_surname: "",
      gender: "",
      phone: "",
      email: "",
      age: 0,
      birthdate: "",
    });
  };

  const createPatient = () => {
    let id = "";
    patientServices.insertPatient(patient).then((res) => {
      if (res?.status == 201) {
        id = res?.patient_id;
        onSave(id);
      } else {
        setTitleAlert("No se logró guardar el paciente");
        setMessageAlert("Paciente no ha sido guardado, favor de intentar nuevamente.");
        setFuntionAlert(() => setShowAlert(false));
        setShowAlert(true);
      }
    });

    clearPatient();
  };
  //clean inputs end errors
  const clean = () => {
    setPatient({ ...emptyPatient });
    setErrors("");
  };

  const cancel = () => {
    onClose();
    clean();
  };

  const validate_email = (email: string) => {
    let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email.match(pattern) === null) {
      return false;
    } else {
      return true;
    }
  };

  const submit = () => {
    if (validate_email(patient.email)) {
      //save the patient
      createPatient();
      //close modal
      cancel();
    } else {
      setErrors("Campo 'Email' es requerido");
      setTitleAlert("Campo 'Email' es requerido");
      setMessageAlert("");
      setFuntionAlert(() => setShowAlert(false));
      setShowAlert(true);
    }
  };

  const textVariant = "subtitle1";

  return (
    <Modal
      open={showModal}
      onClose={() => cancel()}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "50%",
          height: "85%",
          maxHeight: 500,
          backgroundColor: "white",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <View style={{ paddingVertical: "3%", height: "75%", paddingHorizontal: "5%" }}>
          <Stack direction="row" justifyContent="space-between">
            <Text
              style={{
                color: "#671E75",
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              Registro de Paciente
            </Text>
            <IconButton
              aria-label="delete"
              onClick={() => {
                cancel();
                setValue(null);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <View style={{ width: "100%" }}>
            <Text style={styles.texto}>Nombre(s):*</Text>
            <TextInput
              placeholder="Nombre(s)"
              autoCapitalize={"words"}
              returnKeyType="next"
              onChangeText={(value) => setPatient({ ...patient, names: value })}
              onEndEditing={(event) => setPatient({ ...patient, names: event.nativeEvent.text })}
              onSubmitEditing={() => firstSurnameInput.current.focus()}
              style={styles.inputTextFullWidth}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <Text style={styles.texto}>Primer Apellido:*</Text>
              <TextInput
                placeholder="Primer apellido"
                autoCapitalize={"words"}
                returnKeyType="next"
                onChangeText={(value) => setPatient({ ...patient, first_surname: value })}
                onEndEditing={(event) => setPatient({ ...patient, first_surname: event.nativeEvent.text })}
                onSubmitEditing={() => firstSurnameInput.current.focus()}
                style={styles.inputTextFullWidth}
              ></TextInput>
            </View>
            <View style={{ width: "50%", flexDirection: "column", marginLeft: "1%" }}>
              <Text style={styles.texto}>Segundo Apellido:</Text>
              <TextInput
                placeholder="Segundo Apellido"
                autoCapitalize={"words"}
                returnKeyType="next"
                onChangeText={(value) => setPatient({ ...patient, second_surname: value })}
                onEndEditing={(event) => setPatient({ ...patient, second_surname: event.nativeEvent.text })}
                onSubmitEditing={() => secondSurnameInput.current.focus()}
                style={styles.inputTextRigth}
              ></TextInput>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <Text style={styles.texto}>Fecha de Nacimiento:*</Text>
              <FormControl variant="standard">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateField
                    sx={{
                      width: "99%",
                      borderRadius: "4px",
                      borderBottomWidth: 1,
                      borderBottomColor: "#c8c8c8",
                    }}
                    size="small"
                    value={value}
                    variant="standard"
                    format="DD/MM/YYYY"
                    color="secondary"
                    onChange={(newValue) => {
                      setValue(newValue);
                      var date =
                        newValue?.toDate().getFullYear() +
                        "-" +
                        newValue?.toDate().getMonth() +
                        "-" +
                        newValue?.toDate().getDay();
                      const newdate = new Date(date);
                      newValue != null ? changeBirthdate(newdate) : {};
                    }}
                    onClear={() => {
                      setCleared(true);
                      patient.age = 0;
                    }}
                    clearable
                  />
                </LocalizationProvider>
              </FormControl>
            </View>
            <View style={{ width: "50%", flexDirection: "column", marginLeft: "1%" }}>
              <Text style={styles.texto}>Género:</Text>
              <Select
                size="small"
                placeholder="Seleccionar"
                variant="standard"
                color="secondary"
                sx={{
                  width: "97%",
                  borderBottomWidth: 1,
                  borderBottomColor: "#c8c8c8",
                }}
                onChange={handleChange}
              >
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
                <MenuItem value="O">Otro</MenuItem>
              </Select>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <Text style={styles.texto}>Edad:</Text>
              <TextInput
                placeholder="Edad"
                autoCapitalize={"words"}
                returnKeyType="next"
                value={patient.age.toString()}
                editable={false}
                style={styles.inputTextFullWidth}
              ></TextInput>
            </View>
            <View style={{ width: "50%", flexDirection: "column", marginLeft: "1%" }}>
              <Text style={styles.texto}>Teléfono:</Text>
              <TextInput
                placeholder="(00) 0000 0000"
                autoCapitalize={"words"}
                returnKeyType="next"
                onChangeText={(value) => setPatient({ ...patient, phone: value })}
                onEndEditing={(event) => setPatient({ ...patient, phone: event.nativeEvent.text })}
                onSubmitEditing={() => firstSurnameInput.current.focus()}
                style={styles.inputTextRigth}
              ></TextInput>
            </View>
          </View>
          <View style={{ width: "100%" }}>
            <Text style={styles.texto}>Email:*</Text>
            <TextInput
              placeholder="ejemplo@mail.com"
              autoCapitalize={"words"}
              returnKeyType="next"
              onChangeText={(value) => setPatient({ ...patient, email: value })}
              onEndEditing={(event) => setPatient({ ...patient, email: event.nativeEvent.text })}
              onSubmitEditing={() => emailInput.current.focus()}
              style={styles.inputTextFullWidth}
            ></TextInput>
          </View>
          <Text>*Campos obligatorios</Text>
        </View>
        <View style={{ height: "25%", flexDirection: "row" }}>
          <View style={{ height: "20%", marginTop: "9%", marginLeft: "7%", zIndex: 10 }}>
            <Button
              variant="contained"
              disabled={registerDisabled}
              sx={{
                backgroundColor: registerColor,
                textTransform: "none",
                marginTop: "2%",
                ":hover": {
                  bgcolor: "#9D58AA",
                },
              }}
              onClick={() => {
                createPatient();
                setValue(null);
              }}
            >
              Registrar
            </Button>
          </View>
          <Image
            style={{
              marginTop: "5%",
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            source={require("../../assets/wave_footer.png")}
          />
        </View>
        <AlertDialog
          show={showAlert}
          onCancel={() => setShowAlert(false)}
          title={"" + titleAlert}
          message={"" + messageAlert}
          isSimple={true}
          onConfirm={() => funtionAlert}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputModal: {
    borderTopWidth: 0,
    fontSize: 14,
    borderStartWidth: 0,
    borderEndWidth: 0,
  },
  inputTextFullWidth: {
    width: "100%",
    outline: "none",
    outlineColor: "transparent",
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#c8c8c8",
    marginBottom: "2%",
  },
  inputText: {
    width: "97%",
    marginRight: "2%",
    outline: "none",
    outlineColor: "transparent",
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#c8c8c8",
    marginBottom: "2%",
  },
  inputTextRigth: {
    width: "97%",
    outline: "none",
    outlineColor: "transparent",
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#c8c8c8",
    marginBottom: "2%",
  },
  texto: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: "2%",
  },
});
