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


///////////////////////////////////////////////////////////////////////////////////////////
import { GEN_URL, headers } from "../common/config";

/**
 * Obtiene todos los doctores
 * @returns Array<{
 *   id,
 *   names,
 *   first_surname,
 *   second_surname,
 *   email,
 *   professional_license,
 *   phone,
 *   speciality_card,
 *   office_address,
 *   assistant_name,
 *   speciality,
 * }>
 */
const getDoctors = async () => {
    try {
        const response = await fetch(GEN_URL(`/api/doctors`), {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud para obtener doctores: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en getDoctors: ${error.message}`);
        throw error;
    }
};

/**
 * Guarda la información de un nuevo doctor
 * @param {{
 *   names,
 *   first_surname,
 *   second_surname,
 *   email,
 *   professional_license,
 *   speciality,
 *   phone,
 *   speciality_card,
 *   office_address,
 *   assistant_name
 * }} data
 * @returns number (status)
 */
const insertDoctor = async (data: any) => {
    try {
        const response = await fetch(GEN_URL(`/api/doctors`), {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });

        return response.status;
    } catch (error) {
        console.error(`Error en insertDoctor: ${error.message}`);
        throw error;
    }
};

/**
 * Obtiene un doctor por ID
 * @param {String} doctor_id
 * @returns {
 *   id,
 *   names,
 *   first_surname,
 *   second_surname,
 *   email,
 *   professional_license,
 *   speciality,
 *   phone,
 *   speciality_card,
 *   office_address,
 *   assistant_name,
 *   is_active,
 * }
 */
const getDoctorById = async (doctor_id: String) => {
    try {
        const response = await fetch(GEN_URL(`/api/doctors/${doctor_id}`), {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud para obtener un doctor por ID: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en getDoctorById: ${error.message}`);
        throw error;
    }
};

/**
 * Obtiene un doctor por cotización
 * @returns {
 *   id,
 *   names,
 *   first_surname,
 *   second_surname,
 *   email,
 *   professional_license,
 *   phone,
 *   speciality_card,
 *   office_address,
 *   assistant_name,
 *   speciality,
 * }
 */
const getDoctorByQuote = async () => {
    try {
        const response = await fetch(GEN_URL(`/api/get-doctor-by-quote`), {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud para obtener un doctor por cotización: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en getDoctorByQuote: ${error.message}`);
        throw error;
    }
};

/**
 * Verifica si existen campos repetidos antes de insertar un nuevo doctor
 * @param {Object} data
 * @returns {
 *   bool Result,
 *   email,
 *   professional_license,
 *   speciality_card,
 * }
 */
const validateDoctor = async (data: any) => {
    try {
        const response = await fetch(GEN_URL(`/api/check_existing_doctor?email=${data.email}&professional_license=${data.professional_license}&speciality_card=${data.speciality_card}`), {
            method: "GET",
            headers: headers,
        });

        return await response.json();
    } catch (error) {
        console.error(`Error en validateDoctor: ${error.message}`);
        throw error;
    }
};

export default {
    getDoctors,
    insertDoctor,
    getDoctorById,
    getDoctorByQuote,
    validateDoctor,
};

