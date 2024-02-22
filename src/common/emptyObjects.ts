import { CURRENT_QUOTING_VERSION, DEFAULT_COSTS_ADDITIONAL_MATERIAL_MARGIN } from "./config";
import { ICostsCategoryFixed, ICostsCategoryFixedVariable, ICostsHospital, ICostsMultipleCategoryVariable, IDoctor, IHospital, IMultipleCategories, IMultipleCategoriesVariable, IPatient, IQuote, IQuoteDetails, ISingleCategory, ISingleVariableCategory } from "./Interfaces";

export const emptyDoctor: IDoctor = {
    id: "",
    names: "",
    first_surname: "",
    second_surname: "",
    email: "",
    professional_license: "",
    speciality: "",
    phone: "",
    speciality_card: "",
    office_address: "",
    assistant_name: "",
};

export const emptyPatient: IPatient = {
    id: '',
    names: '',
    first_surname: '',
    second_surname: '',
    birthdate: '',
    gender: '',
    age: 0,
    phone: '',
    email: ''
}

export const emptyHospital: IHospital = {
    id: "",
    display_name: "",
    dbname: "",
    address: "",
    tax: ""
}

export const emptySingleCategory: ISingleCategory = { id: "", category: "", total_cost: 0, total_price: 0 };
export const emptySingleVariableCategory: ISingleVariableCategory = { amount: 0, category: "", total_cost: 0, total_price: 0 }
export const emptyMultipleCategories: IMultipleCategories = { selection: [], total_cost: 0, total_price: 0 }
export const emptyMultipleCategoriesVariable: IMultipleCategoriesVariable = { selection: [{ ...emptySingleCategory }], total_cost: 0, total_price: 0, margin: 0 }

export const emptyDetails: IQuoteDetails = {
    version: CURRENT_QUOTING_VERSION,
    total_cost: 0,
    subtotal_price: 0,
    room: { ...emptySingleVariableCategory },
    surgical_suite: { ...emptySingleVariableCategory },
    anesthesia: { ...emptySingleVariableCategory },
    imaging: { ...emptyMultipleCategories },
    drugs: { ...emptySingleCategory },
    laboratories: { ...emptyMultipleCategories },
    qx_material: { ...emptySingleCategory },
    equipment: { ...emptyMultipleCategories },
    instruments: { ...emptyMultipleCategories },
    additional_material: { ...emptyMultipleCategoriesVariable, margin: DEFAULT_COSTS_ADDITIONAL_MATERIAL_MARGIN },
}

export const emptyCostsCategoryFixed: ICostsCategoryFixed = { category: "", description: "", fixed_cost: 0, fixed_price: 0 }
export const emptyCostsCategoryFixedVariable: ICostsCategoryFixedVariable = { category: "", description: "", fixed_cost: 0, fixed_price: 0, variable_cost: 0, variable_price: 0, conditional_hours: 0 }
export const emptyCostsMultipleCategoryVariable: ICostsMultipleCategoryVariable = { fixed_cost: 0, fixed_price: 0, types: [{ ...emptyCostsCategoryFixed }] }

export const emptyCosts: ICostsHospital = {
    room: [{ ...emptyCostsCategoryFixedVariable }],
    surgical_suite: [{ ...emptyCostsCategoryFixedVariable }],
    imaging: [{ ...emptyCostsCategoryFixed }],
    drugs: [{ ...emptyCostsCategoryFixed }],
    laboratories: [{ ...emptyCostsCategoryFixed }],
    qx_material: [{ ...emptyCostsCategoryFixed }],
    equipment: [{ ...emptyCostsMultipleCategoryVariable }],
    instruments: [{ ...emptyCostsMultipleCategoryVariable }],
    anesthesia: [{ ...emptyCostsCategoryFixedVariable }],
}

export const emptyQuote: IQuote = {
    id: "",
    quote_number: "",
    patient_id: "",
    doctor: { ...emptyDoctor },
    patient: { ...emptyPatient },
    hospital: { ...emptyHospital },
    quote_details: { ...emptyDetails },
    mprocedure_name: "",
    doctor_id: "",
    hospital_id: "",
    user_id: "",
    created_at: "",
    valid_until: "",
    update_date: "",
    additional_material_margin: 0,
    margin: 0,
    cost: 0.00,
    subtotal: 0.00,
    total: 0.00,
    discount: 0.00,
    doctor_names: "",
    doctor_surname: "",
    patient_names: "",
    patient_surname: "",
}

