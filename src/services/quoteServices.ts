import { IQuote } from '../common/Interfaces';
import { GEN_URL, headers } from '../common/config';

/**
 * * Get all quotes
 * @return {
 * id,
 * quote_number,
 * patient_id,
 * mprocedure_name,
 * doctor_id,
 * hospital_id,
 * hospital_name,
 * valid_until,
 * created_at,
 * cost,
 * margin,
 * subtotal,
 * total,
 * discount,
 * update_date,
 * doctor_names,
 * doctor_surname,
 * patient_names,
 * patient_surname,
 * user_names,
 * }
 */
const getQuotes = async () => {
	return fetch(GEN_URL(`/api/quotes`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

/**
 * * Insert new quote
 * @param {
 * patient_id,
 * doctor_id,
 * hospital_id,
 * mprocedure_name,
 * details_json,
 * valid_until,
 * cost,
 * margin,
 * subtotal,
 * discount,
 * total,
 * update_date,
 * user_id
 * }
 */
const insertQuote = async (data: any) => {
	return fetch(GEN_URL('/api/quotes'), {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(data)
	}).then((res) => {
		return res.json();
	});
};

/**
 * * Update quote
 * @param {
 * id,
 * details_json,
 * valid_until,
 * update_date,
 * cost,
 * margin,
 * subtotal,
 * discount,
 * total,
 * id (is user id)
 * }
 */
const updateQuote = async (quote_id: string, data: IQuote) => {
	console.log(data);
	return fetch(GEN_URL(`/api/quotes/${quote_id}`), {
		method: 'PUT',
		headers: headers,
		body: JSON.stringify(data)
	}).then((res) => {
		return res.status;
	});
};

/**
 * * Delete quote
 * @param id
 */
const deleteQuote = async (id: String) => {
	return fetch(GEN_URL(`/api/quotes/${id}`), {
		method: 'DELETE',
		headers: headers
	}).then((res) => {
		return res.status;
	});
};

/**
 * * Get quote by id
 * @param quote_id
 * @returns {
 * id,
 * quote_number,
 * patient_id,
 * mprocedure_name,
 * doctor_id,
 * hospital_id,
 * details_json,
 * valid_until,
 * update_date,
 * cost,
 * margin,
 * subtotal,
 * total,
 * discount,
 * doctor_names,
 * doctor_surname,
 * patient_names,
 * patient_surname,
 * }
 */
const getQuoteByID = async (quote_id: String) => {
	return fetch(GEN_URL(`/api/quote/${quote_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

/**
 * * Get quote by number
 * @param number
 * @returns {
 * id,
 * quote_number,
 * patient_id,
 * mprocedure_name,
 * doctor_id,
 * hospital_id,
 * details_json,
 * valid_until,
 * created_at,
 * cost,
 * margin,
 * subtotal,
 * total,
 * discount,
 * doctor_names,
 * doctor_surname,
 * patient_names,
 * patient_surname,
 * update_date,
 * }
 */
const getQuoteByNumber = async (number: String) => {
	return fetch(GEN_URL(`/api/quote/search_number/${number}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

/**
 * * Get quotes by doctor id
 * @param doctor_id
 * @returns {
 * id,
 * quote_number,
 * patient_id,
 * mprocedure_name,
 * doctor_id,
 * hospital_id,
 * valid_until,
 * created_at,
 * cost,
 * margin,
 * subtotal,
 * total,
 * discount,
 * doctor_names,
 * doctor_surname,
 * patient_names,
 * patient_surname,
 * update_date,
 * display_name,
 * }
 */
const getQuotesByDoctor = async (doctor_id: String) => {
	return fetch(GEN_URL(`/api/quotes_by_doctor/${doctor_id}`), {
		method: 'GET',
		headers: headers
	}).then((res) => {
		return res.json();
	});
};

export default {
	getQuotes,
	insertQuote,
	updateQuote,
	deleteQuote,
	getQuoteByID,
	getQuoteByNumber,
	getQuotesByDoctor
};
