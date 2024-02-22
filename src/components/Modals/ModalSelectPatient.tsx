import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, ScrollView, View, StyleSheet } from "react-native";
import { Box, Modal, Input } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
// import { emptyPatient } from "../../common/emptyObjects";
// import { patientDisplayName } from "../../common/functions";
// import { IPatient } from "../../common/Interfaces";
import { emptyPatient, patientDisplayName, IPatient } from "../../common/index";


export const ModalSelectPatient = ({
  showModal,
  patients,
  setSelectedPatient,
  onClose,
}: {
  showModal: boolean;
  patients: Array<IPatient>;
  setSelectedPatient: (patient: IPatient) => void;
  onClose: () => void;
}) => {
  const [filteredPatients, setFilteredPatients] = useState<Array<IPatient>>(patients);

  useEffect(() => setFilteredPatients(patients), [showModal]);

  const filterPatients = (text: string) => {
    if (text !== "") {
      text = text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const filtered: Array<IPatient> = patients.filter((item: IPatient) => {
        let lookup = `${item.names} ${item.first_surname} ${item.second_surname} ${item.email} ${item.phone}`
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        return lookup.includes(text);
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const onSelectPatient = (patient: IPatient) => {
    setFilteredPatients(patients);
    setSelectedPatient(patient);
    onClose();
  };

  return (
    <Modal
      open={showModal}
      onClose={() => onClose()}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Seleccionar Paciente</Text>
          <IconButton onClick={onClose} style={{ marginTop: "-2%" }}>
            <CloseIcon />
          </IconButton>
        </View>
        <Input
          disableUnderline={true}
          fullWidth={true}
          placeholder="Buscar paciente"
          onChange={(text) => filterPatients(text.target.value)}
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            marginBottom: "3%",
            paddingTop: "2%",
            paddingBottom: "2%",
            paddingLeft: "2%",
            boxShadow: 2,
            flex: 1,
          }}
        />
        <ScrollView
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            flex: 7,
          }}
        >
          {filteredPatients.map((sectionId) => (
            <Box>
              <TouchableOpacity
                key={`item-${sectionId}`}
                onPress={() => onSelectPatient(sectionId)}
                style={{ paddingVertical: "4%", paddingHorizontal: "3%" }}
              >
                <Text style={{ fontSize: 14 }}>{patientDisplayName(sectionId)}</Text>
              </TouchableOpacity>
              <Divider />
            </Box>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(250,250,250)",
    width: "30%",
    height: "75%",
    borderRadius: 4,
    padding: "2%",
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
});
