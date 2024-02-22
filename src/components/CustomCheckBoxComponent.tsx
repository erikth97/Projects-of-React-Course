import { ICostsCategoryFixed } from "../common/Interfaces";
import { FormGroup, FormControlLabel, Checkbox, SelectChangeEvent, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { v4 as uuidv4 } from "uuid";
import { View, Text } from "react-native";

export const CustomCheckBoxComponent = ({
  values,
  items,
  onChange,
}: {
  values: Array<string>;
  items: Array<ICostsCategoryFixed>;
  onChange: (selected: string) => void;
}) => {
  return (
    <FormGroup>
      {items.map((item: ICostsCategoryFixed) => (
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "30%" }}>
          <FormControlLabel
            key={uuidv4()}
            control={
              <Checkbox
                color="secondary"
                value={item.category}
                onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
                checked={values.includes(item.category)}
              />
            }
            label={item.category}
          />
          <Tooltip
            title={<h3 style={{ marginTop: "-1%", marginBottom: "-1%" }}>{item.description}</h3>}
            placement="right"
          >
            <InfoOutlinedIcon color="disabled"></InfoOutlinedIcon>
          </Tooltip>
        </View>
      ))}
      {/* // TODO añadir modal */}
    </FormGroup>
  );
};
