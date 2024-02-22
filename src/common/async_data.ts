import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { DATA_STORAGE } from "./storage_keys";
import { IDoctor, IHospital, IPatient } from "./Interfaces";
import doctorServices from "../services/doctorServices";
import patientServices from "../services/patientServices";
import hospitalServices from "../services/hospitalServices";
//import { doctorServices, patientServices, hospitalServices } from "../services/index"


export const getDoctors = async () => {
    let doctors: Array<IDoctor> = [];
    doctors = await doctorServices.getDoctors()
    return doctors;
};

export const getHelperData = async () => {
    let data: { hospitals: Array<IHospital>; patients: Array<IPatient> } = { hospitals: [], patients: [] };
    data.patients = await patientServices.getPatients();
    data.hospitals = await hospitalServices.getHospitals();
    return data;
};

export const uploadAllData = async () => {
    await NetInfo.fetch().then(async (state) => {
        if (state.isConnected) {
            const result = await AsyncStorage.multiGet([
                DATA_STORAGE.NEW_DOCTORS_DATA,
                DATA_STORAGE.NEW_PATIENTS_DATA,
                DATA_STORAGE.DOCTORS_DATA,
            ]);

            const doctors: Array<IDoctor> = result[0][1] ? JSON.parse(result[0][1]) : [];
            const patients: Array<IDoctor> = result[1][1] ? JSON.parse(result[1][1]) : [];

            let unsentDoctors = doctors.map(async (doctor) => {
                let include = true;
                doctorServices.insertDoctor(doctor).then((res) => {
                    if (res == 200) include = false;
                })
                    .catch((error) => {
                        console.log(error);
                        include = true;
                    });
                return include;

            });

            let unsentPatients = patients.map(async (patient) => {
                let include = true;
                patientServices.insertPatient(patient).then((res) => {
                    if (res?.status == 201) {
                        include = false;
                    }
                }).catch((error) => {
                    console.log(error);
                    include = true;
                });
                return include;
            });

            AsyncStorage.multiSet([
                [DATA_STORAGE.DOCTORS_DATA, JSON.stringify(unsentDoctors)],
                [DATA_STORAGE.NEW_PATIENTS_DATA, JSON.stringify(unsentPatients)],
            ]);
        }
    });
};

export const clean = () => {
    AsyncStorage.multiRemove([
        DATA_STORAGE.COSTS,
        DATA_STORAGE.DOCTORS_DATA,
        DATA_STORAGE.HOSPITALS_DATA,
        DATA_STORAGE.LAST_PATIENTS_DATA,
        DATA_STORAGE.NEW_PATIENTS_DATA,
        DATA_STORAGE.NEW_DOCTORS_DATA,
        DATA_STORAGE.PATIENTS_DATA,
        DATA_STORAGE.NEW_QUOTES_DATA,
    ]);
};
