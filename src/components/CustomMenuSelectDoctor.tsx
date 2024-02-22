import React, { useEffect, useState } from "react";
import { Keyboard, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { RegisterDoctor } from "./Modals/ModalRegisterDoctor";
import { LinearGradient } from "expo-linear-gradient";
import CloseIcon from "@mui/icons-material/Close";
// import { IDoctor } from "../common/Interfaces";
// import { doctorDisplayName } from "../common/functions";
// import { ROUTES } from "../common/routes";
// import { emptyDoctor } from "../common/emptyObjects";
// import { getDoctors } from "../common/async_data";
import { IDoctor, doctorDisplayName, ROUTES, emptyDoctor, getDoctors } from "../common/index"


import {
  InputBase,
  Backdrop,
  CircularProgress,
  IconButton,
  Paper,
  Button,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";

const config = { dependencies: { "linear-gradient": LinearGradient } };

export const SelectDoctorNew = ({ navigation }: { navigation: any }) => {
  const [doctors, setDoctors] = useState<Array<IDoctor>>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Array<IDoctor>>([]);

  const [doctorSelected, setDoctorSelected] = useState<IDoctor>({ ...emptyDoctor });

  const [nextDisabled, setNextDisabled] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState(false);

  const [searchDoctor, setSearchDoctor] = useState<IDoctor>({ ...emptyDoctor });
  const [showBackdrop, setShowBackdrop] = useState<boolean>(true);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => fetchDoctors());
    const openKeyboardListener = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
    const closeKeyboardListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));
    return () => {
      focusListener();
      openKeyboardListener.remove();
      closeKeyboardListener.remove();
    };
  }, [navigation]);

  const fetchDoctors = async () => {
    let doctors = await getDoctors();
    setDoctors(doctors);
    setFilteredDoctors(doctors);
    setShowBackdrop(false);
  };

  const filterDoctors = (text: string) => {
    if (text !== "") {
      text = text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const filtered: Array<IDoctor> = doctors.filter((item: IDoctor) => {
        let lookup =
          `${item.names} ${item.first_surname} ${item.second_surname} ${item.email} ${item.speciality} ${item.phone}`
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
        return lookup.includes(text);
      });
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  };

  const onSelectDoctor = (doctor: IDoctor) => {
    setFilteredDoctors(doctors);
    setDoctorSelected(doctor);
    setNextDisabled(doctor.id === "");
  };

  const useGenericDoctor = () => {
    const idx = doctors.findIndex((doctor) => doctor.id === "00000000-0000-0000-0000-000000000000");
    setDoctorSelected(doctors[idx]);
    goToDoctorQuotes(doctors[idx]);
    setNextDisabled(false);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const onCreateNew = () => {
    closeModal();
    fetchDoctors();
  };

  const clear = () => {
    onSelectDoctor({ ...emptyDoctor });
    setSearchDoctor({ ...searchDoctor, names: "" });
  };

  const nextColor = () => (nextDisabled ? "#9b9b9b" : "#DD163A");
  const goToDoctorQuotes = (doctor: any) => navigation.navigate(ROUTES.DOCTOR_QUOTES, { doctor });

  return (
    <LinearGradient colors={["#671E75", "#A12CB8"]} style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ flex: 3, paddingLeft: "2%" }}>
        <Text style={{ fontSize: 42, fontWeight: "700", color: "white", marginBottom: "2%" }}>Buscar Médico:</Text>
        <View style={{ backgroundColor: "white", borderRadius: 10, marginBottom: "-0.7%" }}>
          <Paper component="form" sx={{ display: "flex", justifyContent: "space-between" }}>
            <InputBase
              sx={{ ml: "3.5%", backgroundColor: "transparent", width: "90%" }}
              placeholder="Buscar"
              onChange={(text) => {
                filterDoctors(text.target.value);
                setSearchDoctor({ ...searchDoctor, names: text.target.value });
              }}
              value={searchDoctor.names !== "" ? searchDoctor.names : doctorDisplayName(doctorSelected)}
              inputProps={{ "aria-label": "Buscar" }}
            />
            <IconButton type="button" sx={{ paddingRight: 3, width: 10 }} aria-label="search" onClick={clear}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </Paper>
        </View>
        <View style={{ maxHeight: "70%" }}>
          <ScrollView>
            <List sx={{ backgroundColor: "white" }}>
              {doctors.map((item) => {
                return (
                  <ListItem disablePadding sx={{ backgroundColor: "white" }}>
                    <ListItemButton
                      sx={{ paddingY: "2%", paddingLeft: "4%" }}
                      onClick={() => {
                        onSelectDoctor(item);
                        setSearchDoctor({ ...searchDoctor, names: "" });
                      }}
                    >
                      <Text
                        style={{
                          color: "coolGray.800",
                          fontWeight: "500",
                        }}
                      >
                        {doctorDisplayName(item)}
                      </Text>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </ScrollView>
        </View>
      </View>
      <View style={{ flex: 2, flexDirection: "column", alignSelf: "center", marginRight: "3%" }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <View>
            <View style={{ marginBottom: "7%", width: "50%" }}>
              <Button
                variant="contained"
                disabled={nextDisabled}
                sx={{
                  backgroundColor: nextColor,
                  textTransform: "none",
                  marginTop: "2%",
                  ":hover": {
                    bgcolor: "#DD163A",
                  },
                }}
                onClick={() => goToDoctorQuotes(doctorSelected)}
              >
                Siguiente
              </Button>
            </View>
            <Text style={{ color: "#fff", marginBottom: "3%" }}>¿No encuentra el médico que busca?</Text>
            <TouchableOpacity onPress={() => openModal()} style={{ marginBottom: "3%" }}>
              <Text style={{ color: "#fff", fontWeight: "800", textDecorationLine: "underline" }}>
                Registre un nuevo médico
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => useGenericDoctor()}>
              <Text style={{ color: "#fff", fontWeight: "800", textDecorationLine: "underline" }}>
                Cotizar sin médico
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <RegisterDoctor showModal={showModal} onCancel={closeModal} onSave={onCreateNew} />
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
