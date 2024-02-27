import { GEN_URL, headers } from "../common/config";

/**
 * * Get user_id by email
 * @param email
 * @return {
 * category,
 * }
 */
const getUserIdByEmail = async (email: string): Promise<any> => {
    return await fetch(GEN_URL(`/api/user_email/${email}`), {
        method: "GET",
        headers: headers,
    }).then((res) => {
        return res.json();
    });
};

export default {
    getUserIdByEmail,
};
///
import { GEN_URL, headers } from "../common/config";

/**
 * Realiza la llamada a la API para obtener el user_id por email
 * @param email 
 * @returns Promise<any>
 */
const callApiForUserId = async (email: string): Promise<any> => {
    const response = await fetch(GEN_URL(`/api/user_email/${email}`), {
        method: "GET",
        headers: headers,
    });

    // Manejar errores de red y lanzar una excepción si la respuesta no es exitosa
    if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    // Manejar errores en la conversión a JSON
    try {
        return await response.json();
    } catch (error) {
        throw new Error(`Error al procesar la respuesta JSON: ${error.message}`);
    }
};

/**
 * Obtiene el user_id por email
 * @param email 
 * @returns Promise<any>
 */
const getUserIdByEmail = async (email: string): Promise<any> => {
    try {
        const result = await callApiForUserId(email);
        return result;
    } catch (error) {
        // Manejar errores de manera adecuada, por ejemplo, podrías loggear el error o lanzar una nueva excepción
        console.error(`Error en getUserIdByEmail: ${error.message}`);
        throw error;
    }
};

export default {
    getUserIdByEmail,
};
