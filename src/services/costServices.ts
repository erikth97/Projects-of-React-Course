import { GEN_URL, headers } from '../common/config';

/**
 * * Room costs and prices by hospital id
 * @param hospital_id
 * @return {
 * category,
 * description,
 * fixed_cost,
 * fixed_price,
 * valriable_cost,
 * variable_price
 * }
 */
const getCostsRoom = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs/room/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

/**
 * * Surgical suit costs and prices by hospital id
 * @param hospital_id
 * @return {
 * category,
 * description,
 * fixed_cost,
 * fixed_price,
 * valriable_cost,
 * variable_price
 * }
 */
const getCostsSurgicalSuite = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs/surgical_suite/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

/**
 * * Imaging costs and prices by hospital id
 * @param hospital_id
 * @return {
 * category,
 * description,
 * fixed_cost,
 * fixed_price,
 * valriable_cost,
 * variable_price
 * }
 */
const getCostsImaging = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs/imaging/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};
/**
 * * Drugs costs and prices by hospital id
 * @param hospital_id
 * @return {
 * category,
 * description,
 * fixed_cost,
 * fixed_price,
 * valriable_cost,
 * variable_price
 * }
 */
const getCostsDrugs = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs/drugs/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};
/**
 * * Laboratories costs and prices by hospital id
 * @param hospital_id
 * @return {
 * category,
 * description,
 * fixed_cost,
 * fixed_price,
 * valriable_cost,
 * variable_price
 * }
 */
const getCostsLaboratories = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs/laboratories/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};
/**
 * * QX Material costs and prices by hospital id
 * @param hospital_id
 * @return {
 * category,
 * description,
 * fixed_cost,
 * fixed_price,
 * valriable_cost,
 * variable_price
 * }
 */
const getCostsQxMaterial = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs/qx_material/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};
/**
 * * Equipment costs and prices by hospital id
 * @param hospital_id
 * @return {
 * category,
 * description,
 * fixed_cost,
 * fixed_price,
 * valriable_cost,
 * variable_price
 * }
 */
const getCostsEquipment = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs/equipment/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};
/**
 * * Instruments costs and prices by hospital id
 * @param hospital_id
 * @return {
 * category,
 * description,
 * fixed_cost,
 * fixed_price,
 * valriable_cost,
 * variable_price
 * }
 */
const getCostsInstruments = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs/instruments/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

/**
 * * Anesthesia costs and prices by hospital id
 * @param hospital_id
 * @return {
 * category,
 * description,
 * fixed_cost,
 * fixed_price,
 * valriable_cost,
 * variable_price
 * }
 */
const getCostsAnesthesia = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs/anesthesia/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

/**
 * * Get all costs
 * @param hospital_id
 * @returns {
 * room,
 * surgical_suite,
 * imaging,
 * laboratories,
 * qx_material,
 * equipment,
 * instruments,
 * anesthesia,
 * drugs,
 * }
 */
const getAllCostsByHospitalId = async (hospital_id: string) => {
	return fetch(GEN_URL(`/api/costs_by_hospital?`) + new URLSearchParams({ hospital_id }), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

export {
	getCostsRoom,
	getCostsSurgicalSuite,
	getCostsImaging,
	getCostsDrugs,
	getCostsLaboratories,
	getCostsQxMaterial,
	getCostsEquipment,
	getCostsInstruments,
	getCostsAnesthesia,
	getAllCostsByHospitalId
};

//////////////////////////////////////////////////////
import { GEN_URL, headers } from '../common/config';

const fetchCostsByType = async (hospital_id: string, costType: string): Promise<any> => {
    const response = await fetch(GEN_URL(`/api/costs/${costType}/${hospital_id}`), {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`Error en la solicitud para ${costType}: ${response.statusText}`);
    }

    try {
        return await response.json();
    } catch (error) {
        throw new Error(`Error al procesar la respuesta JSON para ${costType}: ${error.message}`);
    }
};

const getAllCostsByHospitalId = async (hospital_id: string): Promise<any> => {
    const response = await fetch(GEN_URL(`/api/costs_by_hospital?`) + new URLSearchParams({ hospital_id }), {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`Error en la solicitud para todos los costos: ${response.statusText}`);
    }

    try {
        return await response.json();
    } catch (error) {
        throw new Error(`Error al procesar la respuesta JSON para todos los costos: ${error.message}`);
    }
};

export {
    fetchCostsByType,
    getAllCostsByHospitalId
};


const costsRoom = await fetchCostsByType(hospital_id, 'room');
const costsSurgicalSuite = await fetchCostsByType(hospital_id, 'surgical_suite');
// ... (hacer lo mismo para los demás tipos de costos)

const allCosts = await getAllCostsByHospitalId(hospital_id);

