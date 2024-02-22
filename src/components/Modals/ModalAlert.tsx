import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Modal } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const AlertDialog = ({
    show,
    onConfirm,
    onCancel,
    title,
    message,
    isSimple
}: {
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
    isSimple: boolean;
}) => {

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={show} onClose={() => onCancel()}
            closeAfterTransition
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <View style={isSimple
                ? styles.containersimple
                : styles.containerDouble}>
                <View style={{ flexDirection: "column", flex: 1 }}>
                    <View style={styles.iconRow}>
                        <ErrorOutlineIcon fontSize="large" />
                    </View>
                    <View style={styles.message}>
                        <View style={{ flexDirection: "column", justifyContent: "center" }}>
                            <Text style={styles.tilte}>{title}</Text>
                            <Text style={styles.text}>{message}</Text>
                        </View>
                    </View>

                    {isSimple
                        ? <View style={{ flexDirection: "row", flex: 1, justifyContent: "center", marginBottom: "4%", height: 25 }}>
                            <Button variant="contained" color="inherit" size="large" style={{
                                marginRight: "3%",
                                marginLeft: "3%",
                                marginBottom: "3%",
                                width: "90%",
                                height: 45
                            }} onClick={() => onCancel()}>Ok</Button>
                        </View>
                        : <View style={{ flexDirection: "row", flex: 1, justifyContent: "center", marginBottom: "4%", height: 45 }}>
                            <Button variant="contained" color="inherit" style={{ marginRight: "5%", width: "40%", height: 45 }} onClick={() => onCancel()}>Cancelar</Button>
                            <Button variant="contained" color="error" style={{ width: "40%", height: 45 }} onClick={() => onConfirm()}>Aceptar</Button>
                        </View>}
                </View>
            </View>

        </Modal>
    );
}
const styles = StyleSheet.create({
    containerDouble: {
        minHeight: "30%",
        maxHeight: 600,
        width: "25%",
        backgroundColor: "#FFFFFF",
        //paddingVertical: "1%",
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        padding: "2%"
    },
    containersimple: {
        minHeight: "20%",
        maxHeight: 250,
        width: "25%",
        backgroundColor: "#FFFFFF",
        paddingVertical: "1%",
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: "2%"
    },
    tilte: {
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
    },
    text: {
        fontSize: 14,
        fontWeight: "300",
        textAlign: "center",
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: "3%"
    },
    message: {
        flex: 3,
        alignSelf: "center",
        marginTop: "3%"
    },
});