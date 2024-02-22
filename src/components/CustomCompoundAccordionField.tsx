import { ICostsCategoryFixed, ICostsCategoryFixedVariable } from "../common/Interfaces";
import { Box, MenuItem, Select, TextField, Typography, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { View, Text } from "react-native";

export const CustomCompoundAccordionField = ({
  firstFieldTitle,
  firstDefaultValue,
  secondFieldTitle,
  secondDefaultValue,
  isEditable,
  items,
  onChangeFirstField = () => {},
  onChangeSecondField = () => {},
}: {
  firstFieldTitle: string;
  firstDefaultValue: string;
  secondFieldTitle: string;
  secondDefaultValue: number;
  isEditable: boolean;
  items: Array<ICostsCategoryFixedVariable>;
  onChangeFirstField?: (type: ICostsCategoryFixedVariable) => void;
  onChangeSecondField?: (value: number) => void;
}) => {
  const onChange = (value: string) => {
    let newValue = items.find((item: ICostsCategoryFixed) => item.description == value);
    newValue = {
      category: newValue?.category || "",
      description: newValue?.description || "",
      fixed_cost: newValue?.fixed_cost || 0,
      fixed_price: newValue?.fixed_price || 0,
      variable_cost: newValue?.variable_cost || 0,
      variable_price: newValue?.variable_price || 0,
    };
    onChangeFirstField(newValue);
  };

  return (
    <Box display={"flex"} flexDirection={"row"}>
      <Box display={"flex"} flexDirection={"column"} width={"30%"} marginRight={5}>
        <Typography sx={{ color: "text.secondary" }}>Tipo de {firstFieldTitle}</Typography>
        <Select
          defaultValue={firstDefaultValue}
          onChange={(event) => onChange(event.target.value as string)}
          renderValue={(Select) => {
            let item: ICostsCategoryFixed = items.filter((item: ICostsCategoryFixed) => item.description == Select)[0];

            return <Text style={{ fontSize: 16 }}>{item.category}</Text>;
          }}
          color="secondary"
        >
          {items.map((item: ICostsCategoryFixed) => (
            <MenuItem value={item.description}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                {item.category}
                <Tooltip
                  title={<h3 style={{ marginTop: "-1%", marginBottom: "-1%" }}>{item.description}</h3>}
                  placement="right"
                >
                  <InfoOutlinedIcon color="disabled"></InfoOutlinedIcon>
                </Tooltip>
              </View>
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box display={"flex"} flexDirection={"column"} maxWidth={"10%"}>
        <Typography sx={{ color: "text.secondary" }}>{secondFieldTitle}</Typography>
        <TextField
          variant="outlined"
          type="number"
          disabled={!isEditable}
          color="secondary"
          InputProps={{
            inputProps: { min: 0 },
            inputMode: "numeric",
          }}
          defaultValue={secondDefaultValue.toString()}
          onChange={(event) => onChangeSecondField(parseFloat(event.target.value as string))}
        ></TextField>
      </Box>
      {/* //TODO Modal */}
    </Box>
  );
};
