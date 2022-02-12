var { sql } = require("../stores/database");

const runner = async () => {
  console.log(await sql`SELECT * FROM organizations`);
};

/**
 * HERE ARE THE ORGANIZATION QUERIES
 */
//  "name",
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

// get organization details by id
const getOrganizationByIdQuery = async (id) => {
  return await sql`SELECT * FROM organizations
  WHERE id = ${id}`;
};

// get organization details by email
const getOrganizationByEmailQuery = async (email) => {
  return await sql`SELECT * FROM organizations
  WHERE email = ${email}`;
};

// get organization details by name
const getOrganizationByNameQuery = async (name) => {
  return await sql`SELECT * FROM organizations
  WHERE name = ${name}`;
};

// update organization details by id
const updateOrganizationByIdQuery = async (id, payload) => {
  return await sql`UPDATE organizations SET ${sql(
    payload,
    "name",
    "email",
    "phonenumber",
    "logo",
    "address",
    "city",
    "state",
    "country",
    "updated_at",
    "logged_at",
    "deleted_at"
  )}
  WHERE id = ${id}
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
  WHERE id = ${id}
  RETURNING *`;
};

module.exports = {
  runner,
  signUpOrganizationQuery,
  getOrganizationByIdQuery,
  getOrganizationByEmailQuery,
  getOrganizationByNameQuery,
  updateOrganizationByIdQuery,
  verifyOrganizationQuery,
  changePasswordByOrganizationIdQuery,
};
