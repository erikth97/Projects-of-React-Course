import React, { useEffect, useState } from "react";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { ColorType } from "native-base/lib/typescript/components/types";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Modal, Divider } from "@mui/material";
// import { CurrencyFormatter } from "../../common/functions";
// import { IQuote } from "../../common/Interfaces";
// import { DEFAULT_COSTS_MIN_MARGIN, DEFAULT_COSTS_SUGGESTED_MARGIN } from "../../common/config";
import { CurrencyFormatter, IQuote, DEFAULT_COSTS_SUGGESTED_MARGIN } from "../../common/index"
// import { FinalQuoteDuplicateQuote } from "./ModalDuplicateQuote"; * SE DECLARA PERO NO SE USA


export const FinalQuoteTotalInput = ({
  showModal,
  quote,
  colors,
  onSave,
  onCancel,
}: {
  showModal: boolean;
  quote: IQuote;
  colors: Array<{ min: number; max: number; color: ColorType }>;
  onSave: (input: number) => void;
  onCancel: () => void;
}) => {
  const [input, setInput] = useState<number>(quote.subtotal);
  const [margin, setMargin] = useState<number>(0);
  const [marginColor, setMarginColor] = useState<ColorType>("black");
  const [editDisabled, setEditDisabled] = useState<boolean>(false);

  const markup = quote.quote_details.additional_material.total_price;
  const x_40 = -(3 * markup - (quote.cost * 10) / 2) / 3;
  const x_70 = -(3 * markup - quote.cost * 10) / 3;

  const precioV_40 = x_40 + markup;
  const precioV_70 = x_70 + markup;

  useEffect(() => {
    if (quote.subtotal <= 0) {
      setEditDisabled(true);
    } else {
      setEditDisabled(false);
    }
  }, [input]);

  useEffect(() => {
    const value = input > 0 ? input : quote.subtotal;
    let m = 0;
    if (value === 0) {
      m = 0;
    } else {
      //m = (value * 100) / quote.subtotal;
      //m = (value - quote.cost) / value;
      m = 1 - quote.cost / value;
      const { color }: { color: ColorType } = colors.filter((x) => m >= x.min && m < x.max).shift() || {
        min: 0,
        max: 0,
        color: "black",
      };
      setMarginColor(color);
    }
    setMargin(m);
  }, [quote.cost, quote.margin, margin, input]);

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
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#671E75" }}>Editar total</Text>
          <TouchableOpacity onPress={() => onCancel()}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <Divider style={{ marginBottom: "2%", marginTop: "2%" }} />
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "10%" }}>Total Mínimo:</Text>
          <Text style={{ fontSize: 15 }}>{CurrencyFormatter.format(precioV_40 || 0)}</Text>
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "10%" }}>
            Total Sugerido:
          </Text>
          <Text style={{ fontSize: 15 }}>{CurrencyFormatter.format(precioV_70 || 0)}</Text>
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "10%", marginTop: "1%" }}>
            Total:
          </Text>
          <TextInput
            defaultValue={quote.subtotal.toFixed(2)}
            keyboardType="numeric"
            onChangeText={(value) => setInput(parseFloat(value))}
            style={{
              borderWidth: 2,
              borderRadius: 4,
              marginBottom: "3%",
              paddingLeft: 3,
              borderColor: "#E0E0E0",
            }}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: "2%", marginLeft: "10%" }}>
            Margen de Contribución:
          </Text>
          <Text style={{ fontSize: 15 }}>
            {parseFloat((margin * 100).toFixed(2)) > 0 && !Number.isNaN(input) ? (margin * 100).toFixed(2) : 0} %
          </Text>
        </View>
        <Divider style={{ marginBottom: "2%" }} />
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginRight: "5%" }}>
          <Button
            variant="contained"
            disabled={input <= x_40 || Number.isNaN(input)}
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
