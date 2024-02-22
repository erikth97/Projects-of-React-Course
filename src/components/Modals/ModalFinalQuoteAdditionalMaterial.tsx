import React, { useEffect, useState } from "react";
import { Platform, TextInput, Text, View, TouchableOpacity } from "react-native";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Modal, Divider } from "@mui/material";
// import { CurrencyFormatter } from "../../common/functions";
// import { DEFAULT_COSTS_ADDITIONAL_MATERIAL_MARGIN } from "../../common/config";
// import { IMultipleCategoriesVariable } from "../../common/Interfaces";
import { CurrencyFormatter, DEFAULT_COSTS_ADDITIONAL_MATERIAL_MARGIN, IMultipleCategoriesVariable } from "../../common/index"


export const ModalFinalQuoteAdditionalMaterial = ({
  showModal,
  additionalMaterial,
  onSave,
  onCancel,
}: {
  showModal: boolean;
  additionalMaterial: IMultipleCategoriesVariable;
  onSave: (input: number) => void;
  onCancel: () => void;
}) => {
  const [input, setInput] = useState<number>(additionalMaterial.total_price);
  const [margin, setMargin] = useState<number>(0);
  const [editDisabled, setEditDisabled] = useState<boolean>(false);

  const total_min_addittional_mat = additionalMaterial.total_cost * 0.03;
  const total_sug_additional_mat = additionalMaterial.total_cost * DEFAULT_COSTS_ADDITIONAL_MATERIAL_MARGIN;
  const disabled: boolean = additionalMaterial.total_cost <= 0 ? true : false;

  useEffect(() => {
    if (additionalMaterial.total_price <= 0) {
      setEditDisabled(true);
    } else {
      setEditDisabled(false);
    }
  }, [input]);
  useEffect(() => {
    const value = input > 0 ? input : additionalMaterial.total_price;
    //const m = 1 - (additionalMaterial.total_cost / value);
    let m = 0;
    if (value === 0) {
      m = 0;
    } else {
      //m=((value - additionalMaterial.total_cost) / additionalMaterial.total_cost)
      m = value / additionalMaterial.total_cost;
    }
    setMargin(m);
  }, [additionalMaterial.total_cost, additionalMaterial.total_price, margin, input]);

  return (
    <Modal
      open={showModal}
      onClose={() => onCancel()}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: "47%",
          width: "25%",
          backgroundColor: "#FFFFFF",
          paddingVertical: "1%",
          borderRadius: 8,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1, marginHorizontal: "5%" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#671E75" }}>Editar Material a Vista</Text>
          <TouchableOpacity
            onPress={() => {
              setInput(total_sug_additional_mat);
              onCancel();
            }}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <Divider style={{ marginBottom: "2%", marginTop: "2%" }} />
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "10%" }}>Total Mínimo:</Text>
          <Text style={{ fontSize: 15 }}>{CurrencyFormatter.format(total_min_addittional_mat || 0)}</Text>
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "10%" }}>
            Total Sugerido:
          </Text>
          <Text style={{ fontSize: 15 }}>{CurrencyFormatter.format(total_sug_additional_mat)}</Text>
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "10%", marginTop: "1%" }}>
            Total:
          </Text>
          <TextInput
            defaultValue={additionalMaterial.total_price.toFixed(2)}
            keyboardType="numeric"
            style={{ borderWidth: 2, borderRadius: 4, marginBottom: "3%", paddingLeft: 3, borderColor: "#E0E0E0" }}
            onChangeText={(value) => setInput(parseFloat(value) || 0)}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "10%" }}>Markup:</Text>
          <Text style={{ fontSize: 15 }}>
            {parseFloat((margin * 100).toFixed(2)) > 0 ? (margin * 100).toFixed(2) : 0} %
          </Text>
        </View>
        <Divider style={{ marginBottom: "2%" }} />
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginRight: "5%" }}>
          <Button
            variant="contained"
            disabled={input <= total_min_addittional_mat ? true : false}
            sx={{
              backgroundColor: "#671E75",
              textTransform: "none",
              marginTop: "2%",
              ":hover": {
                bgcolor: "#8f21aa",
              },
            }}
            onClick={() => onSave(input)}
          >
            Guardar
          </Button>
        </View>
      </View>
    </Modal>
  );
};
