import { GEN_URL, headers } from "../common/config";

/**
 * * Gel all doctors
 * @returns {
 * id,
 * names,
 * first_surname,
 * second_surname,
 * email,
 * professional_license,
 * phone,
 * speciality_card,
 * office_address,
 * assistant_name,
 * speciality,
 * }
 */
const getDoctors = async () => {
    return await fetch(GEN_URL(`/api/doctors`), {
        method: "GET",
        headers: headers,
    }).then((res) => {
        return res.json();
    });
};

/**
 * * Save new doctor info
 * @param {
 * names,
 * fisrt_surname,
 * second_surname,
 * email,
 * professional_license,
 * speciality,
 * phone,
 * speciality_card,
 * office_address,
 * assistant_name
 * }
 */
const insertDoctor = async (data: any) => {
    return fetch(GEN_URL(`/api/doctors`), {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    }).then((res) => {
        return res.status;
    });
};

/**
 * * Update doctor
 */

/**
 * * Delete doctor
 */

/**
 * * Get doctor by id
 * @param doctor_id
 * @returns {
 * id,
 * names,
 * fisrt_surname,
 * second_surname,
 * email,
 * professional_license,
 * speciality,
 * phone,
 * speciality_card,
 * office_address,
 * assistant_name,
 * is_active,
 * }
 */
const getDoctorById = async (doctor_id: String) => {
    return await fetch(GEN_URL(`/api/doctors/${doctor_id}`), {
        method: "GET",
        headers: headers,
    }).then((res) => {
        return res.json();
    });
};

/**
 * * Get doctor by quote
 * @returns {
 * id,
 * names,
 * first_surname,
 * second_surname,
 * email,
 * professional_license,
 * phone,
 * speciality_card,
 * office_address,
 * assistant_name,
 * speciality,
 * }
 */
const getDoctorByQuote = async () => {
    return await fetch(GEN_URL(`/api/get-doctor-by-quote`), {
        method: "GET",
        headers: headers,
    }).then((res) => {
        return res.json();
    });
};

/**
 * * Check if there is repeated fields before insert a new doctor
 * @returns {
 * bool Result,
 * email,
 * professional_license,
 * speciality_card,
 * }
 */
const validateDoctor = async (data: any) => {
    return fetch(GEN_URL(`/api/check_existing_doctor?email=${data.email}&professional_license=${data.professional_license}&speciality_card=${data.speciality_card}`), {
        method: "GET",
        headers: headers,
    }).then((res) => {
        return res.json();
    });
};

export default {
    getDoctors,
    insertDoctor,
    getDoctorById,
    getDoctorByQuote,
    validateDoctor,
};
