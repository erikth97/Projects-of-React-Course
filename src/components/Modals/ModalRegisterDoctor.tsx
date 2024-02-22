import React, { useRef, useState, MutableRefObject, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, Image, StyleSheet } from "react-native";
import { Modal, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import { AlertDialog } from "./ModalAlert";
import doctorServices from "../../services/doctorServices";
// import { emptyDoctor } from "../../common/emptyObjects";
// import { IDoctor } from "../../common/Interfaces";
import { emptyDoctor, IDoctor } from "../../common/index"

export const RegisterDoctor = ({
  showModal,
  onCancel,
  onSave,
}: {
  showModal: boolean;
  onCancel: () => void;
  onSave: () => void;
}) => {
  const firstSurnameInput = useRef() as MutableRefObject<HTMLDivElement>;
  const secondSurnameInput = useRef() as MutableRefObject<HTMLDivElement>;
  const emailInput = useRef() as MutableRefObject<HTMLDivElement>;
  const professionalLicenseInput = useRef() as MutableRefObject<HTMLDivElement>;
  const specialityInput = useRef() as MutableRefObject<HTMLDivElement>;
  const phoneInput = useRef() as MutableRefObject<HTMLDivElement>;
  const specialityCardInput = useRef() as MutableRefObject<HTMLDivElement>;
  const officeAddressInput = useRef() as MutableRefObject<HTMLDivElement>;
  const assistantNameInput = useRef() as MutableRefObject<HTMLDivElement>;

  const [doctor, setDoctor] = useState<IDoctor>({ ...emptyDoctor });
  const [errors, setErrors] = useState<string>("");

  const [registerDisabled, setRegisterDisabled] = useState<boolean>(true);
  const registerColor = () => (registerDisabled ? "light" : "#671E75");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [titleAlert, setTitleAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [funtionAlert, setFuntionAlert] = useState<Function>(() => { });

  useEffect(() => {
    const canRegister =
      doctor.names !== "" &&
      doctor.first_surname !== "" &&
      doctor.email !== "" &&
      doctor.speciality !== "" &&
      doctor.phone !== "";
    setRegisterDisabled(!canRegister);
  }, [doctor, setDoctor]);

  const addDoctor = () => {
    doctorServices.insertDoctor(doctor).then((res) => {
      if (res == 200) {
        setTitleAlert("");
        setMessageAlert("Doctor se ha guardado correctamente, aparecerá en la lista de doctores.");
        setFuntionAlert(() => {
          setShowAlert(false);
          cancel();
        });
        setShowAlert(true);
        save();
        cancel();
      } else {
        setTitleAlert("No se logró guardar el médico");
        setMessageAlert("Médico no ha sido guardado, favor de intentar nuevamente.");
        setFuntionAlert(() => setShowAlert(false));
        setShowAlert(true);
      }
    });
  };

  const save = () => {
    onSave();
    setDoctor({ ...emptyDoctor });
  };

  //clean inputs from modal and errors
  const clean = () => {
    setDoctor({ ...emptyDoctor });
    setErrors("");
  };

  //close modal
  const cancel = () => {
    onCancel();
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
  // TODO: the alert has yet to be displayed
  const submit = () => {
    if (validate_email(doctor.email)) {
      let data = {
        email: doctor.email,
        speciality_card: doctor.speciality_card,
        professional_license: doctor.professional_license,
      };

      let repeated_fields: string[] = [];
      doctorServices
        .validateDoctor(data)
        .then((res) => {
          if (res.doctor_exists) {
            if (res.email > 0) repeated_fields.push("Correo");
            if (doctor.professional_license && res.professional_license != 0) {
              repeated_fields.push("Cédula profesional");
            }
            if (doctor.speciality_card && res.speciality_card != 0) {
              repeated_fields.push("Cédula de especialidad");
            }
            setTitleAlert("Médico no ha sido guardado.");
            setMessageAlert(
              "Ya existen registros con los mismos datos para los siguientes campos: " + repeated_fields.join(", ")
            );
            setShowAlert(true);
          } else {
            // Guardamos al médico
            addDoctor();
            cancel();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setErrors("Email es un campo requerido");
    }
  };
  return (
    <SafeAreaView style={{ height: "90%" }}>
      <Modal open={showModal} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Stack
          sx={{
            width: "45%",
            height: "80%",
            maxHeight: 430,
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: "24%",
            pt: "1%",
            px: "2%",
            overflow: "hidden",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 2,
          }}
        >
          <View>
            <View style={{ marginTop: "1%", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "#671E75" }}>Registro de médico</Text>
              <IconButton aria-label="delete" onClick={() => cancel()}>
                <CloseIcon />
              </IconButton>
            </View>
            <View style={{ marginTop: "column", justifyContent: "space-between", marginBottom: "5%" }}>
              <View style={{ marginVertical: "1%", width: "100%" }}>
                <Text style={styles.texto}>Nombre(s):*</Text>
                <TextInput
                  value={doctor.names}
                  placeholder="Nombre(s)"
                  textContentType="givenName"
                  autoCapitalize={"words"}
                  onEndEditing={(event) => setDoctor({ ...doctor, names: event.nativeEvent.text })}
                  onChangeText={(value) => setDoctor({ ...doctor, names: value })}
                  returnKeyType="next"
                  onSubmitEditing={() => firstSurnameInput.current.focus()}
                  style={styles.inputTextFullWidth}
                />
              </View>
              <View style={{ flexDirection: "row", marginTop: "1%", width: "100%" }}>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>Primer apellido:*</Text>
                  <TextInput
                    value={doctor.first_surname}
                    placeholder="Primer apellido"
                    textContentType="familyName"
                    autoCapitalize={"words"}
                    onEndEditing={(event) => setDoctor({ ...doctor, first_surname: event.nativeEvent.text })}
                    onChangeText={(value) => setDoctor({ ...doctor, first_surname: value })}
                    returnKeyType="next"
                    onSubmitEditing={() => secondSurnameInput.current.focus()}
                    style={styles.inputText}
                  />
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>Segundo apellido:</Text>
                  <TextInput
                    value={doctor.second_surname}
                    placeholder="Segundo apellido"
                    textContentType="familyName"
                    autoCapitalize={"words"}
                    onEndEditing={(event) => setDoctor({ ...doctor, second_surname: event.nativeEvent.text })}
                    onChangeText={(value) => setDoctor({ ...doctor, second_surname: value })}
                    returnKeyType="next"
                    onSubmitEditing={() => specialityInput.current.focus()}
                    style={styles.inputText}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: "1%", width: "100%" }}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.texto}>Especialidad:*</Text>
                  <TextInput
                    value={doctor.speciality}
                    placeholder="Especialidad"
                    autoCapitalize={"words"}
                    onEndEditing={(event) => setDoctor({ ...doctor, speciality: event.nativeEvent.text })}
                    onChangeText={(value) => setDoctor({ ...doctor, speciality: value })}
                    returnKeyType="next"
                    onSubmitEditing={() => professionalLicenseInput.current.focus()}
                    style={styles.inputText}
                  />
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.texto}>Cédula profesional:</Text>
                  <TextInput
                    value={doctor.professional_license}
                    placeholder="0000000000"
                    keyboardType="phone-pad"
                    onEndEditing={(event) => setDoctor({ ...doctor, professional_license: event.nativeEvent.text })}
                    onChangeText={(value) => setDoctor({ ...doctor, professional_license: value })}
                    returnKeyType="next"
                    onSubmitEditing={() => specialityCardInput.current.focus()}
                    style={styles.inputText}
                  />
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: "1%", width: "100%" }}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.texto}>Cédula de especialidad:</Text>
                  <TextInput
                    value={doctor.speciality_card}
                    placeholder="0000000000"
                    keyboardType="phone-pad"
                    onEndEditing={(event) => setDoctor({ ...doctor, speciality_card: event.nativeEvent.text })}
                    onChangeText={(value) => setDoctor({ ...doctor, speciality_card: value })}
                    returnKeyType="next"
                    onSubmitEditing={() => emailInput.current.focus()}
                    style={styles.inputText}
                  />
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.texto}>Nombre asistente:</Text>
                  <TextInput
                    value={doctor.assistant_name}
                    placeholder="Nombre(s) apellidos"
                    autoCapitalize={"words"}
                    onEndEditing={(event) => setDoctor({ ...doctor, assistant_name: event.nativeEvent.text })}
                    onChangeText={(value) => setDoctor({ ...doctor, assistant_name: value })}
                    style={styles.inputText}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: "1%", width: "100%" }}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.texto}>Correo electrónico:*</Text>
                  <TextInput
                    value={doctor.email}
                    placeholder="usuario@hospital.mx"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onEndEditing={(event) => setDoctor({ ...doctor, email: event.nativeEvent.text })}
                    onChangeText={(value) => setDoctor({ ...doctor, email: value })}
                    returnKeyType="next"
                    onSubmitEditing={() => phoneInput.current.focus()}
                    style={styles.inputText}
                  />
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.texto}>Teléfono:*</Text>
                  <TextInput
                    value={doctor.phone}
                    placeholder="(00) 0000 0000"
                    textContentType="telephoneNumber"
                    keyboardType="phone-pad"
                    onEndEditing={(event) => setDoctor({ ...doctor, phone: event.nativeEvent.text })}
                    onChangeText={(value) => setDoctor({ ...doctor, phone: value })}
                    returnKeyType="next"
                    onSubmitEditing={() => officeAddressInput.current.focus()}
                    style={styles.inputText}
                  />
                </View>
              </View>
              <View style={{ marginTop: "1%", width: "100%" }}>
                <Text style={styles.texto}>Dirección de consultorio:</Text>
                <TextInput
                  value={doctor.office_address}
                  placeholder="Calle, número, colonia, municipio"
                  autoCapitalize={"words"}
                  onEndEditing={(event) => setDoctor({ ...doctor, office_address: event.nativeEvent.text })}
                  onChangeText={(value) => setDoctor({ ...doctor, office_address: value })}
                  returnKeyType="next"
                  onSubmitEditing={() => assistantNameInput.current.focus()}
                  style={styles.inputTextFullWidth}
                />
              </View>
              <Text style={{ fontSize: 14, marginBottom: "3%" }}>* Campos obligatorios</Text>
            </View>
          </View>
          <View
            style={{
              height: "27%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "-6%",
              marginLeft: "-6%",
            }}
          >
            <View style={{ height: "80%", marginTop: "2%", marginLeft: "7%" }}>
              <Button
                variant="contained"
                disabled={registerDisabled}
                sx={{
                  backgroundColor: registerColor,
                  textTransform: "none",
                  marginTop: "5%",
                  zIndex: 2,
                  ":hover": {
                    bgcolor: "#9D58AA",
                  },
                }}
                onClick={() => submit()}
              >
                Registrar
              </Button>
            </View>
            <Image
              source={require("../../assets/wave_footer.png")}
              style={{
                width: "110%",
                height: "100%",
                position: "absolute",
                zIndex: -2,
              }}
            />
            <View style={{ backgroundColor: "#DDC9E0" }}></View>
          </View>
          <AlertDialog
            show={showAlert}
            onCancel={() => setShowAlert(false)}
            title={"" + titleAlert}
            message={"" + messageAlert}
            isSimple={true}
            onConfirm={() => funtionAlert}
          />
        </Stack>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  inputTextFullWidth: {
    width: "99%",
    marginRight: "2%",
    outline: "none",
    outlineColor: "transparent",
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#c8c8c8",
  },
  inputText: {
    width: "98%",
    marginRight: "2%",
    outline: "none",
    outlineColor: "transparent",
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#c8c8c8",
  },
  texto: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
