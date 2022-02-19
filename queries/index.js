var { sql } = require("../stores/database");

const runner = async () => {
  console.log(await sql`SELECT * FROM organizations`);
};

/**
 * HERE ARE THE ORGANIZATION QUERIES
 */
//  "name",
// "description",
//  "email",
//  "password",
//  "phonenumber",
//  "logo",
//  "address",
//  "city",
//  "state",
//  "country"

// signing up an organization
const signUpOrganizationQuery = async (payload) => {
  return sql`INSERT INTO organizations ${sql(
    payload,
    "name",
    "email",
    "password"
  )}RETURNING *`;
};

// get all organization details
const getAllOrganizationsQuery = async () => {
  return await sql`SELECT * FROM organizations WHERE deleted_at IS NULL`;
};

// get organization details by id
const getOrganizationByIdQuery = async (id) => {
  return await sql`SELECT * FROM organizations
  WHERE id = ${id} AND deleted_at IS NULL`;
};

// get organization details by email
const getOrganizationByEmailQuery = async (email) => {
  return await sql`SELECT * FROM organizations
  WHERE email = ${email} AND deleted_at IS NULL`;
};

// get organization details by name
const getOrganizationByNameQuery = async (name) => {
  return await sql`SELECT * FROM organizations
  WHERE name = ${name} AND deleted_at IS NULL`;
};

// update organization details by id
const updateOrganizationByIdQuery = async (id, payload) => {
  return await sql`UPDATE organizations SET ${sql(
    payload,
    "name",
    "description",
    "phonenumber",
    "logo",
    "address",
    "city",
    "state",
    "country",
    "updated_at"
  )}
  WHERE id = ${id} AND deleted_at IS NULL
  RETURNING *`;
};

// update organization verification
const verifyOrganizationQuery = async (email) => {
  return await sql`UPDATE organizations SET verified = ${true}
  WHERE email = ${email}
  AND 
  deleted_at IS NULL
  RETURNING *`;
};

// update organization details by email
const changePasswordByOrganizationIdQuery = async (id, pay) => {
  return await sql`UPDATE organizations SET ${sql(
    pay,
    "password",
    "updated_at"
  )}
  WHERE id = ${id} AND deleted_at IS NULL
  RETURNING *`;
};

/**************************************
 * EMPLOYEE QUERIES
 ***********************************/

// "company_id",
// "department_id","unit_id","first_name",
// "last_name","phonenumber","email",
// "gender","avatar","job_title",
// "appointment","status",
// "address",
// "city",
// "state",
// "country",
// "school",
// "degree",
// "grade",
// "resume",
// "bank_name",
// "bank_account_number",
// "bank_username",
// "date_of_birth",
// "next_of_kin_first_name",
// "next_of_kin_last_name",
// "next_of_kin_phonenumber",
// "next_of_kin_email",
// "next_of_kin_gender",
// "next_of_kin_relationship",
// "next_of_kin_date_of_birth",
// "next_of_kin_address",
// "next_of_kin_city",
// "next_of_kin_state",
// "next_of_kin_country",
// "updated_at",
// "deleted_at",

// Adding a New Admin
const addEmployeeQuery = async (payload) => {
  return sql`INSERT INTO employees ${sql(
    payload,
    "company_id",
    "department_id",
    // "unit_id",
    "first_name",
    "last_name",
    "middle_name",
    "phonenumber",
    "email",
    "gender",
    "avatar",
    "job_title",
    "appointment",
    "status",
    "address",
    "city",
    "state",
    "country",
    "school",
    "degree",
    "grade",
    "resume",
    "bank_name",
    "bank_account_number",
    "bank_username",
    "date_of_birth",
    "next_of_kin_first_name",
    "next_of_kin_last_name",
    "next_of_kin_phonenumber",
    "next_of_kin_email",
    "next_of_kin_gender",
    "next_of_kin_relationship",
    "next_of_kin_date_of_birth",
    "next_of_kin_address",
    "next_of_kin_city",
    "next_of_kin_state",
    "next_of_kin_country"
  )}RETURNING *`;
};

// update employee details by id
const updateEmployeeByIdQuery = async (id, payload) => {
  return await sql`UPDATE employees SET ${sql(
    payload,
    "department_id",
    // "unit_id",
    "first_name",
    "last_name",
    "middle_name",
    "phonenumber",
    "email",
    "gender",
    "avatar",
    "job_title",
    "appointment",
    "status",
    "address",
    "city",
    "state",
    "country",
    "school",
    "degree",
    "grade",
    "resume",
    "bank_name",
    "bank_account_number",
    "bank_username",
    "date_of_birth",
    "next_of_kin_first_name",
    "next_of_kin_last_name",
    "next_of_kin_phonenumber",
    "next_of_kin_email",
    "next_of_kin_gender",
    "next_of_kin_relationship",
    "next_of_kin_date_of_birth",
    "next_of_kin_address",
    "next_of_kin_city",
    "next_of_kin_state",
    "next_of_kin_country",
    "updated_at",
    "deleted_at"
  )}
  WHERE id = ${id} AND deleted_at IS NULL
  RETURNING *`;
};

// get employee details by id
const getEmployeeByIdQuery = async (id) => {
  return await sql`SELECT * FROM employees
  WHERE id = ${id} AND deleted_at IS NULL`;
};

// get all Employees details
const getAllEmployeesQuery = async () => {
  return await sql`SELECT * FROM employees WHERE deleted_at IS NULL`;
};

/**************************************
 * DEPARTMENT QUERIES
 ***********************************/

// Adding a New Department
const addDepartmentQuery = async (payload) => {
  return sql`INSERT INTO departments ${sql(
    payload,
    "name",
    "description",
    "company_id",
    "email",
    "phonenumber"
  )}RETURNING *`;
};

// get all departments details
const getAllDepartmentsQuery = async () => {
  return await sql`SELECT * FROM departments WHERE deleted_at IS NULL`;
};

// get department details by id
const getDepartmentByIdQuery = async (id) => {
  return await sql`SELECT * FROM departments
  WHERE id = ${id} AND deleted_at IS NULL`;
};

// update department details by id
const updateDepartmentByIdQuery = async (id, payload) => {
  return await sql`UPDATE departments SET ${sql(
    payload,
    "name",
    "description",
    "email",
    "phonenumber",
    "updated_at",
    "deleted_at"
  )}
  WHERE id = ${id} AND deleted_at IS NULL
  RETURNING *`;
};

module.exports = {
  runner,
  signUpOrganizationQuery,
  getAllOrganizationsQuery,
  getOrganizationByIdQuery,
  getOrganizationByEmailQuery,
  getOrganizationByNameQuery,
  updateOrganizationByIdQuery,
  verifyOrganizationQuery,
  changePasswordByOrganizationIdQuery,
  addEmployeeQuery,
  getAllEmployeesQuery,
  updateEmployeeByIdQuery,
  getEmployeeByIdQuery,
  addDepartmentQuery,
  getAllDepartmentsQuery,
  getDepartmentByIdQuery,
  updateDepartmentByIdQuery,
};
