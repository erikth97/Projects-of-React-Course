import { GEN_URL, headers } from '../common/config';

/**
 * * Get all hospitals
 * @returns {
 * id,
 * display_name,
 * dbname,
 * address,
 * float tax,
 * }
 */
const getHospitals = async () => {
	return fetch(GEN_URL(`/api/hospitals`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

/**
 * * Insert hospital
 */

/**
 * * Update hospital
 */

/**
 * * Get hospital by id
 * @param hospital_id
 * @returns {
 * id,
 * display_name,
 * dbname,
 * address,
 * float tax,
 * }
 */
const getHospitalById = async (hospital_id: String) => {
	return fetch(GEN_URL(`/api/hospitals/${hospital_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

export default {
	getHospitals,
	getHospitalById
};
