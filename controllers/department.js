const {
  addDepartmentQuery,
  getAllDepartmentsQuery,
  updateDepartmentByIdQuery,
  getDepartmentByIdQuery,
} = require("../queries/index");
const { sendMail } = require("../config/mailer");
const redis = require("../config/redis");
const uuid = require("uuid");
var httpStatus = require("http-status");
var { APIError } = require("../config/error");
const argon2 = require("argon2");
var jwt = require("jsonwebtoken");
const { now } = require("../utils");

const addNewDepartment = async (payload) => {
  try {
    "name", "description", "company_id", "email", "phonenumber";

    if (!payload.name) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the name of the department",
        errors: "No department name provided",
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
        message: "Please enter the phonenumber of the department",
        errors: "No phonenumber provided",
      });
    }

    if (!payload.email) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the email of the department",
        errors: "No email provided",
      });
    }

    const data = await addDepartmentQuery(payload);

    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const getAllDepartments = async () => {
  try {
    const data = await getAllDepartmentsQuery();
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const updateDepartmentById = async (id, payload) => {
  try {
    const [department] = await getDepartmentByIdQuery(id);
    if (!department) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Department does not exist",
        errors: "Department does not exist",
      });
    }

    const pay = {
      name: payload.name || department.name,
      description: payload.description || department.description,
      phonenumber: payload.phonenumber || department.phonenumber,
      email: payload.email || department.email,
      updated_at: now(),
    };

    const [data] = await updateDepartmentByIdQuery(department.id, pay);
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

module.exports = {
  addNewDepartment,
  getAllDepartments,
  updateDepartmentById,
};
