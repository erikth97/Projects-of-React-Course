import { Checkbox, HStack, Modal, Text, Select, VStack, Input, Pressable } from "native-base";
import React, { useState } from "react";
import { ICostsCategoryFixed, ICostsCategoryFixedVariable } from "../common/Interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";

const CheckBoxModal = ({ item }: { item: ICostsCategoryFixed }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <HStack space={2}>
        <Checkbox key={uuidv4()} value={item.category}>
          {item.category}
        </Checkbox>
        <Pressable onPress={() => setIsOpen(!isOpen)}>
          <MaterialIcons key={uuidv4()} name="help-outline" size={24} color="blue" />
        </Pressable>
      </HStack>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{item.category}</Modal.Header>
          <Modal.Body>
            {item.description.split(";").map((d: string) => (
              <Text key={uuidv4()}>{d}</Text>
            ))}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export const CheckBoxComponent = ({
  values,
  items,
  onChange,
}: {
  values: Array<string>;
  items: Array<ICostsCategoryFixed>;
  onChange: (selected: Array<string>) => void;
}) => {
  return (
    <Checkbox.Group
      value={values}
      onChange={(selected: Array<string>) => onChange(selected)}
      accessibilityLabel="choose numbers"
    >
      {items.map((item: ICostsCategoryFixed) => (
        <CheckBoxModal key={uuidv4()} item={item} />
      ))}
    </Checkbox.Group>
  );
};

export const SelectComponent = ({
  concept,
  title,
  defaultValue,
  items,
  onSelectionChange,
}: {
  concept: string;
  title: string;
  defaultValue: string;
  items: Array<ICostsCategoryFixed>;
  onSelectionChange: (selected: ICostsCategoryFixed) => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onChange = (description: string) => {
    const newVal = items.find((val) => val.description === description);
    const toSend: ICostsCategoryFixed = {
      category: newVal?.category || "",
      description: newVal?.description || "",
      fixed_cost: newVal?.fixed_cost || 0,
      fixed_price: newVal?.fixed_price || 0,
    };

    onSelectionChange(toSend);
  };

  return (
    <>
      <Text color="black" marginBottom="3">
        {title}
      </Text>
      <HStack space={2}>
        <Select defaultValue={defaultValue} onValueChange={(description) => onChange(description)} width="40">
          {items.map((item: ICostsCategoryFixed) => (
            <Select.Item key={uuidv4()} label={item.category} value={item.description} />
          ))}
        </Select>
        <Pressable onPress={() => setIsOpen(!isOpen)}>
          <MaterialIcons key={uuidv4()} name="help-outline" size={24} color="blue" />
        </Pressable>
      </HStack>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{concept}</Modal.Header>
          <Modal.Body>
            <VStack>
              {items.map((item: any) => (
                <VStack key={uuidv4()}>
                  <Text key={uuidv4()} fontWeight="bold">
                    {item.category}:{" "}
                  </Text>
                  <VStack key={uuidv4()}>
                    {item.description.split(";").map((description: string) => (
                      <Text key={uuidv4()} paddingLeft="4">
                        {description}
                      </Text>
                    ))}
                  </VStack>
                </VStack>
              ))}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export const CompoundSelectComponent = ({
  concept,
  valueTitle,
  defaultValue,
  items,
  value,
  valueEditable = false,
  onSelectionChange = () => {},
  onValueChange = () => {},
}: {
  concept: string;
  valueTitle: string;
  defaultValue: string;
  items: Array<ICostsCategoryFixedVariable>;
  value: number;
  valueEditable: boolean;
  onSelectionChange?: (selected: ICostsCategoryFixedVariable) => void;
  onValueChange?: (value: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onChange = (description: string) => {
    const newVal = items.find((val) => val.description === description);
    const toSend: ICostsCategoryFixedVariable = {
      category: newVal?.category || "",
      description: newVal?.description || "",
      fixed_cost: newVal?.fixed_cost || 0,
      fixed_price: newVal?.fixed_price || 0,
      variable_cost: newVal?.variable_cost || 0,
      variable_price: newVal?.variable_price || 0,
    };

    onSelectionChange(toSend);
  };

  return (
    <>
      <HStack space={10}>
        <VStack>
          <Text color="black" marginBottom="3">
            Tipo de {concept}
          </Text>
          <Select defaultValue={defaultValue} onValueChange={(description) => onChange(description)} width="40">
            {items.map((item: ICostsCategoryFixed) => (
              <Select.Item key={uuidv4()} label={item.category} value={item.description} />
            ))}
          </Select>
        </VStack>
        <VStack>
          <Text color="black" marginBottom="3">
            {valueTitle}
          </Text>
          <HStack>
            {valueEditable ? (
              <Input
                onEndEditing={(event) => onValueChange(parseFloat(event.nativeEvent.text))}
                onChangeText={(text) => onValueChange(parseFloat(text))}
                defaultValue={value.toString()}
                width="40"
                keyboardType="numeric"
              />
            ) : (
              <Input isReadOnly={true} isDisabled={true} value={value.toString()} width="40" />
            )}
            <Pressable onPress={() => setIsOpen(!isOpen)}>
              <MaterialIcons key={uuidv4()} name="help-outline" size={24} color="blue" />
            </Pressable>
          </HStack>
        </VStack>
      </HStack>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{concept}</Modal.Header>
          <Modal.Body>
            <VStack>
              {items.map((item: any) => (
                <VStack key={uuidv4()}>
                  <Text key={uuidv4()} fontWeight="bold">
                    {item.category}:{" "}
                  </Text>

                  <VStack key={uuidv4()}>
                    {item.description.split(";").map((description: string) => (
                      <Text key={uuidv4()} paddingLeft="4">
                        {description}
                      </Text>
                    ))}
                  </VStack>
                </VStack>
              ))}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};
