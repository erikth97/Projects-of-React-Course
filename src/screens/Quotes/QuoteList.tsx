import React from "react";
import { useState, useEffect } from "react";
import { GEN_URL } from "../../common/config";
import normalize from "react-native-normalize";
import { ROUTES } from "../../common/routes";
import { LinearGradient } from "expo-linear-gradient";
import { QuoteStatus } from "../../common/storage_keys";
import { emptyQuote } from "../../common/emptyObjects";
import { StyleSheet, TouchableWithoutFeedback, View, Text } from "react-native";
import { InputAdornment, TextField, Backdrop, CircularProgress } from "@mui/material";
import Search from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import quoteServices from "../../services/quoteServices";

export const QuoteList = ({ navigation }: { navigation: any }) => {
    interface IDataList {
        id: string;
        patient_names: string;
        patient_surname: string;
        doctor_names: string;
        doctor_surname: string;
        mprocedure_name: string;
        update_date: string;
        created_at: string;
        hospital_name: string;
        quote_number: string;
    }

    const emptyDataList: IDataList = {
        id: "",
        patient_names: "",
        patient_surname: "",
        doctor_names: "",
        doctor_surname: "",
        mprocedure_name: "",
        update_date: "",
        created_at: "",
        hospital_name: "",
        quote_number: "",
    };
    const [dataList, setDataList] = useState<Array<IDataList>>([{ ...emptyDataList }]);
    const [filteredList, setFilteredList] = useState<Array<IDataList>>([{ ...emptyDataList }]);
    const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

    useEffect(() => {
        setShowBackdrop(true);
        quoteServices.getQuotes().then((quotes) => {
            setDataList(quotes);
            setFilteredList(quotes);
            setShowBackdrop(false);
        })
    }, [])

    const filterData = (text: string) => {
        if (text !== "") {
            text = text
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

            const filtered: Array<IDataList> = dataList.filter((item: IDataList) => {
                let lookup =
                    `${item.doctor_names} ${item.doctor_surname} ${item.patient_names} ${item.patient_surname} ${item.mprocedure_name} ${item.hospital_name}${item.update_date}`
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase();

                return lookup.includes(text);
            });
            setFilteredList(filtered);
        } else {
            setFilteredList(dataList);
        }
    };

    return (
        <LinearGradient colors={["#671E75", "#A12CB8"]} style={{ height: "100%" }}>
            <View
                style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 10,
                    marginVertical: "3%",
                    marginHorizontal: "3%",
                    height: "75%",
                }}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginRight: "3%" }}>
                    <View>
                        <Text style={styles.title}>
                            Listado de Cotizaciones
                        </Text>
                    </View>
                    <View style={{
                        width: "20%",
                        marginLeft: "10%",
                        marginTop: "3.5%",
                    }}>
                        <TextField
                            placeholder="Buscar"
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onChange={(e) => {
                                filterData(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ scale: 2 }}></Search>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </View>
                </View>

                <View style={{ height: "90%" }}>
                    <TableContainer
                        sx={{ height: "80%", width: "98.7%", alignSelf: "center", marginLeft: normalize(1) }} >
                        <Table aria-label="simple table" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Médico</TableCell>
                                    <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Paciente</TableCell>
                                    <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Procedimiento</TableCell>
                                    <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Hospital</TableCell>
                                    <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Última Actualización</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredList.map((item) => (
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            navigation.navigate(ROUTES.QUOTE_SUMMARY, {
                                                quote: {
                                                    ...emptyQuote,
                                                    quote_number: item.quote_number,
                                                },
                                                source: ROUTES.QUOTE_LIST,
                                                status: QuoteStatus.FINISHED,
                                            })
                                        }
                                        }>
                                        <TableRow
                                            hover
                                            key={item.id}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                {item.doctor_names + " " + item.doctor_surname}
                                            </TableCell>
                                            <TableCell>{item.patient_names + " " + item.patient_surname}</TableCell>
                                            <TableCell>{item.mprocedure_name}</TableCell>
                                            <TableCell>{item.hospital_name}</TableCell>
                                            <TableCell>{item.update_date}</TableCell>
                                        </TableRow>
                                    </TouchableWithoutFeedback>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </View>
            </View>
            {renderBackdrop()}
        </LinearGradient>
    );

    function renderBackdrop() {
        return (
            <Backdrop sx={{ color: "#fff", zIndex: 10 }} open={showBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }
};
const styles = StyleSheet.create({
    button: {
        height: "100%",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 15
    },
    title: {
        marginLeft: "10%",
        marginTop: "15%",
        width: "100%",
        fontSize: 28,
        fontWeight: "700",
        color: "#671E75",
    }
});
