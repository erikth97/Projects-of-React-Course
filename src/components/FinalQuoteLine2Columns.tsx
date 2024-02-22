import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { CurrencyFormatter } from "../common/functions";
import { Divider } from "@mui/material";

export const FinalQuoteLine2Columns = ({ titulo, total = 0 }: { titulo: string; total: number }) => {
  return (
    <SafeAreaView>
      <View
        style={{
          marginLeft: 5,
          marginRight: 5,
          paddingTop: "1%",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text></Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={{ fontSize: 14, fontWeight: "400" }}>{titulo}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14 }}>{CurrencyFormatter.format(total)}</Text>
          </View>
        </View>
        <Divider />
      </View>
    </SafeAreaView>
  );
};
