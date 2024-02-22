import { GEN_URL, headers } from "../common/config";

/**
 * * Get all patients
 * @returns {
 * id,
 * names,
 * first_surname,
 * second_surname,
 * birthdate,
 * gender,
 * age,
 * phone,
 * email,
 * created_at,
 * }
 */
const getPatients = async () => {
    return fetch(GEN_URL(`/api/patients`), {
        method: "GET",
    }).then((res) => {
        return res.json();
    });
};

/**
 * * Insert patient
 * @param {
 * names,
 * first_surname,
 * second_surname,
 * birthdate,
 * gender,
 * age,
 * phone,
 * email,
 * }
 */
const insertPatient = async (data: any) => {
    return fetch(GEN_URL(`/api/patients`), {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    }).then(async (response) => {
       if (response.status == 201) {
			let status = response.status;
		 	let res = await response.json();
            let patient_id = res.patient_id
            	return { status, patient_id };
               
		}
    });
};

/**
 * * Update patients
 * @param {
 * id,
 * names,
 * first_surname,
 * second_surname,
 * birthdate,
 * gender,
 * age,
 * phone,
 * email
 * }
 */
const updatePatients = async (data: any) => {
    return fetch(GEN_URL(`/api/patients`), {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
    }).then((res) => {
        return res.status;
    });
};

/**
 * * Get patients by id
 * @param patient_id
 * @returns {
 * id,
 * names,
 * first_surname,
 * second_surname,
 * birthdate,
 * ggender,
 * age,
 * phone,
 * email,
 * created_at,
 * }
 */
const getPatientByID = async (patient_id: String) => {
    return fetch(GEN_URL(`/api/patients/${patient_id}`), {
        method: "GET",
        headers: headers,
    }).then((res) => {
        return res.json();
    });
};

/**
 * Validate patient: checks if there are repited fields befor inserting a new patient
 * @returns {
 * bool Result,
 * email,
 * }
 */
const validatePatient = async () => {
    return fetch(GEN_URL(`/api/check_existing_patient`), {
        method: "GET",
        headers: headers,
    }).then((res) => {
        return res.json();
    });
};

export default {
    getPatients,
    getPatientByID,
    insertPatient,
    updatePatients,
    validatePatient,
};
