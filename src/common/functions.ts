import { IDoctor, IPatient } from "./Interfaces"
import "intl";
import "intl/locale-data/jsonp/en";

export const doctorDisplayName = (doctor: IDoctor): string => {
    if( doctor.id !== "" ) return `${doctor.names} ${doctor.first_surname} ${doctor.second_surname} [${doctor.speciality}]`;
    return ""
}

export const patientDisplayName = (patient: IPatient): string => {
    if( patient.id !== "" ) return `${patient.names} ${patient.first_surname} ${patient.second_surname}`;
    return ""
}

export const CurrencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

