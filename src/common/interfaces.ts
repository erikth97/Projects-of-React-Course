export interface ICostsCategoryFixed { category: string, description: string, fixed_cost: number, fixed_price: number }
export interface ICostsCategoryFixedVariable { category: string, description: string, fixed_cost: number, fixed_price: number, variable_cost: number, variable_price: number, conditional_hours?: number }
export interface ICostsMultipleCategoryVariable { fixed_cost: number, fixed_price: number, types: Array<ICostsCategoryFixed> }

export interface ICostsHospital {
  room: Array<ICostsCategoryFixedVariable>,
  surgical_suite: Array<ICostsCategoryFixedVariable>,
  anesthesia: Array<ICostsCategoryFixedVariable>,

  imaging: Array<ICostsCategoryFixed>,
  drugs: Array<ICostsCategoryFixed>,
  laboratories: Array<ICostsCategoryFixed>,
  qx_material: Array<ICostsCategoryFixed>,

  equipment: Array<ICostsMultipleCategoryVariable>,
  instruments: Array<ICostsMultipleCategoryVariable>,
}

export interface ISingleCategory { id?: string, category: string, total_cost: number, total_price: number }
export interface ISingleVariableCategory { amount: number, category: string, total_cost: number, total_price: number }
export interface IMultipleCategories { selection: Array<string>, total_cost: number, total_price: number }
export interface IMultipleCategoriesVariable { selection: Array<ISingleCategory>, total_cost: number, total_price: number, margin: number }

export interface IQuoteDetails {
  version: string,
  
  total_cost: number, 
  subtotal_price: number
  room: ISingleVariableCategory,
  surgical_suite: ISingleVariableCategory,
  anesthesia: ISingleVariableCategory,
  imaging: IMultipleCategories,
  drugs: ISingleCategory,
  laboratories: IMultipleCategories,
  qx_material: ISingleCategory,

  equipment: IMultipleCategories,
  instruments: IMultipleCategories,

  additional_material: IMultipleCategoriesVariable,
}

export interface IHospital { id: string, display_name: string, dbname: string, address: string, tax: string };
export interface IPatient {
  id?: string,
  names: string,
  first_surname: string,
  second_surname: string,
  birthdate: string,
  gender: string,
  age: number,
  phone: string,
  email: string,
  created_at?: string,
};

export interface IDoctor {
  id?: string,
  names: string,
  first_surname: string,
  second_surname: string,
  email: string,
  professional_license: string,
  phone: string,
  speciality_card: string,
  office_address: string,
  assistant_name: string,
  speciality: string,
}


export interface IQuote {
  id?: string,
  quote_number?: string,
  patient: IPatient,
  doctor: IDoctor,
  hospital: IHospital,
  patient_id: string,
  doctor_id: string,
  hospital_id: string,
  mprocedure_name: string,
  details_json?: string,
  quote_details: IQuoteDetails,
  valid_until?: string,
  cost: number,
  additional_material_margin: number,
  margin: number,
  subtotal: number,
  discount: number,
  total: number,
  suggested_total?: number,
  min_total?: number,
  doctor_names?: string,
  doctor_surname?: string,
  patient_names?: string,
  patient_surname?: string,
  user_id?: string,
  created_at?: string,
  version?: String,
  update_date?: String
}

export interface MSALSecrets {
  access_token: string,
  expires_in: number,
  ext_expires_in?: number,
  id_token?: string,
  refresh_token: string,
  scope?: string,
  token_type?: string,
}