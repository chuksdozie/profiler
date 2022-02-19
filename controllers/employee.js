const {
  addEmployeeQuery,
  getAllEmployeesQuery,
  updateEmployeeByIdQuery,
  getEmployeeByIdQuery,
} = require("../queries/index");
const { sendMail } = require("../config/mailer");
const redis = require("../config/redis");
const uuid = require("uuid");
var httpStatus = require("http-status");
var { APIError } = require("../config/error");
const argon2 = require("argon2");
var jwt = require("jsonwebtoken");
const { now } = require("../utils");

const emailSetup = (email) => {
  // THIS IS TO GENERATE VERIFICATION LINK
  const token = uuid.v4();
  const emailKey = `${process.env.REDIS_PREFIX}-${token}`;
  const mainurl = `${process.env.BASE_URL}/org/verify/${token}`;
  redis.set(emailKey, email);

  const reciever = email;
  const mailSubject = "Welcome to Profiler";
  const mailContent = `<p>Thanks for registering, please <a href="${mainurl}", target="_blank"><button>Verify Email</button></a></p>`;

  return { reciever, mailContent, mailSubject };
};

const addNewEmployee = async (payload) => {
  try {
    //     "company_id","department_id", "unit_id", "first_name",
    // "last_name","middle_name","phonenumber","email","gender","avatar",
    // "job_title","appointment", "status", "address",
    // "city", "state", "country", "school", "degree",
    // "grade", "resume", "bank_name","bank_account_number",
    // "bank_username","next_of_kin_first_name",
    // "next_of_kin_last_name", "next_of_kin_phonenumber",
    // "next_of_kin_email", "next_of_kin_gender",
    // "next_of_kin_relationship" "next_of_kin_date_of_birth",
    // "next_of_kin_address", "next_of_kin_city",
    // "next_of_kin_state", "next_of_kin_country"

    if (!payload.first_name) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the first name of the employee",
        errors: "No first name provided",
      });
    }

    if (!payload.last_name) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the last name of the employee",
        errors: "No last name provided",
      });
    }

    if (!payload.company_id) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter an organization Id",
        errors: "No organization Id",
      });
    }

    if (!payload.phonenumber) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the phonenumber of the employee",
        errors: "No phonenumber provided",
      });
    }

    if (!payload.email) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the email of the employee",
        errors: "No email provided",
      });
    }

    if (!payload.gender) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the gender of the employee",
        errors: "No gender provided",
      });
    }

    const data = await addEmployeeQuery(payload);

    // sendMail(
    //   emailSetUp.reciever,
    //   emailSetUp.mailSubject,
    //   emailSetUp.mailContent
    // );
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const getAllEmployees = async () => {
  try {
    const data = await getAllEmployeesQuery();
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const updateEmployeeById = async (id, payload) => {
  try {
    const [employee] = await getEmployeeByIdQuery(id);
    if (!employee) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Organization does not exist",
        errors: "Organization does not exist",
      });
    }

    const pay = {
      department_id: payload.department_id || employee.department_id,
      first_name: payload.first_name || employee.first_name,
      last_name: payload.last_name || employee.last_name,
      middle_name: payload.middle_name || employee.middle_name,
      phonenumber: payload.phonenumber || employee.phonenumber,
      email: payload.email || employee.email,
      gender: payload.gender || employee.gender,
      avatar: payload.avatar || employee.avatar,
      job_title: payload.job_title || employee.job_title,
      appointment: payload.appointment || employee.appointment,
      status: payload.status || employee.status,
      address: payload.address || employee.address,
      city: payload.city || employee.city,
      state: payload.state || employee.state,
      country: payload.country || employee.country,
      school: payload.school || employee.school,
      degree: payload.degree || employee.degree,
      grade: payload.grade || employee.grade,
      resume: payload.resume || employee.resume,
      bank_name: payload.bank_name || employee.bank_name,
      bank_account_number:
        payload.bank_account_number || employee.bank_account_number,
      bank_username: payload.bank_username || employee.bank_username,
      date_of_birth: payload.date_of_birth || employee.date_of_birth,
      next_of_kin_first_name:
        payload.next_of_kin_first_name || employee.next_of_kin_first_name,
      next_of_kin_last_name:
        payload.next_of_kin_last_name || employee.next_of_kin_last_name,
      next_of_kin_phonenumber:
        payload.next_of_kin_phonenumber || employee.next_of_kin_phonenumber,
      next_of_kin_email:
        payload.next_of_kin_email || employee.next_of_kin_email,
      next_of_kin_gender:
        payload.next_of_kin_gender || employee.next_of_kin_gender,
      next_of_kin_relationship:
        payload.next_of_kin_relationship || employee.next_of_kin_relationship,
      next_of_kin_date_of_birth:
        payload.next_of_kin_date_of_birth || employee.next_of_kin_date_of_birth,
      next_of_kin_address:
        payload.next_of_kin_address || employee.next_of_kin_address,
      next_of_kin_city: payload.next_of_kin_city || employee.next_of_kin_city,
      next_of_kin_state:
        payload.next_of_kin_state || employee.next_of_kin_state,
      next_of_kin_country:
        payload.next_of_kin_country || employee.next_of_kin_country,
      updated_at: now(),
    };

    const [data] = await updateEmployeeByIdQuery(employee.id, pay);
    const { password, ...rest } = data;
    return { ...rest };
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

module.exports = {
  addNewEmployee,
  getAllEmployees,
  updateEmployeeById,
};
