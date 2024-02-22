import { ICostsCategoryFixed } from "../common/Interfaces";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export const CustomAccordionField = ({
  fieldTitle,
  defaultValue,
  concept,
  items,
  onChange,
}: {
  fieldTitle: string;
  defaultValue: string;
  concept: string;
  items: Array<ICostsCategoryFixed>;
  onChange: (selected: ICostsCategoryFixed) => void;
}) => {
  const onChangeValue = (value: string) => {
    let newValue = items.find((item) => item.description === value);
    let valueUpdated: ICostsCategoryFixed = {
      category: newValue?.category || "",
      fixed_cost: newValue?.fixed_cost || 0,
      fixed_price: newValue?.fixed_price || 0,
      description: newValue?.description || "",
    };
    onChange(valueUpdated);
  };

  return (
    <Box display={"flex"} flexDirection={"row"}>
      <Box display={"flex"} flexDirection={"column"} width={"30%"} marginRight={5}>
        <Typography sx={{ color: "text.secondary" }}>{fieldTitle}</Typography>
        <Select
          defaultValue={defaultValue}
          onChange={(event) => onChangeValue(event.target.value as string)}
          color="secondary"
        >
          {items.map((item: ICostsCategoryFixed) => (
            <MenuItem key={uuidv4()} value={item.description}>
              {" "}
              {item.category}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};
