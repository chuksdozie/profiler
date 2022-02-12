const {
  signUpOrganizationQuery,
  getOrganizationByEmailQuery,
  getOrganizationByNameQuery,
  verifyOrganizationQuery,
  getOrganizationByIdQuery,
  updateOrganizationByIdQuery,
  changePasswordByOrganizationIdQuery,
} = require("../queries/index");
const { sendMail } = require("../config/mailer");
const redis = require("../config/redis");
const uuid = require("uuid");
var httpStatus = require("http-status");
var { APIError } = require("../config/error");
const argon2 = require("argon2");
var jwt = require("jsonwebtoken");
const { now } = require("../utils");

const signUpOrganization = async (payload) => {
  try {
    if (!payload.name) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter an organization name",
        errors: "No organization name",
      });
    }

    if (!payload.email) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter an email address",
        errors: "No organization email address",
      });
    }

    if (!payload.password) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter a password",
        errors: "No password input",
      });
    }

    const orgEmail = await getOrganizationByEmailQuery(payload.email);
    const orgName = await getOrganizationByNameQuery(payload.name);

    // THIS IS TO GENERATE VERIFICATION LINK
    const token = uuid.v4();
    const emailKey = `${process.env.REDIS_PREFIX}-${token}`;
    const mainurl = `${process.env.BASE_URL}/org/verify/${token}`;
    redis.set(emailKey, payload.email);

    const reciever = await payload.email;
    const mailSubject = "Welcome to Profiler";
    const mailContent = `<p>Thanks for registering, please <a href="${mainurl}", target="_blank"><button>Verify Email</button></a> to verify your email.</p>`;

    if (orgName.length) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message:
          "This Company Name is already in use, please use a different name",
        errors: "Company Name already exists",
      });
    }
    if (orgEmail.length) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "This email address is already in use, please login instead.",
        errors: "Email address already exists",
      });
    }

    const hashedpassword = await argon2.hash(payload.password);
    const details = {
      name: payload.name,
      email: payload.email,
      password: hashedpassword,
    };
    const [data] = await signUpOrganizationQuery(details);
    sendMail(reciever, mailSubject, mailContent);
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const verifyEmail = async (token) => {
  try {
    const emailKey = `${process.env.REDIS_PREFIX}-${token}`;

    const keyExists = await redis.exists(emailKey);
    // if key does not exist
    if (keyExists === 0) {
      throw new Error("Invalid token");
    }
    const email = await redis.get(emailKey);
    const [verifiedUser] = await verifyOrganizationQuery(email);
    const { password, ...rest } = verifiedUser;
    return [rest, `${verifiedUser.name}, You have been verified`];
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const loginUser = async (payload) => {
  try {
    const [userDetails] = await loginUserQuery(payload.email);
    // const reciever = await payload.email;
    // const mailSubject = "Welcome to Trove";
    // const mailContent = "The content comes here in HTML FORMAT";

    if (!userDetails) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "This email address does not eaxist, please sign up instead.",
        errors: "Email does not exists",
      });
    }
    const password = await payload.password;
    const hashedPassword = await userDetails.password;

    if (await argon2.verify(hashedPassword, password)) {
      const token = jwt.sign(
        {
          id: userDetails.id,
          email: userDetails.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
      return { userDetails, token };
    } else {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        errors: "Incorrect Credentials",
        message: "Incorrect Credentials, Please check and try again",
      });
    }
  } catch (error) {
    console.error(error);
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const updateUserById = async (user, payload) => {
  console.log(user.id, payload);
  try {
    const id = user.id;
    const [userInfo] = await getUserByIdQuery(id);
    if (!userInfo) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "User does not exist",
        errors: "User does not exist",
      });
    }

    if (payload.bank_account_number.length !== 10) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Account Number is incorrect",
        errors: "Account Number is incorrect",
      });
    }

    if (isNaN(payload.bank_account_number)) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Account Number is incorrect",
        errors: "Account Number is incorrect",
      });
    }

    const pay = {
      first_name: payload.first_name || userInfo.first_name,
      last_name: payload.last_name || userInfo.last_name,
      phonenumber: payload.phonenumber || userInfo.phonenumber,
      email: userInfo.email,
      password: userInfo.password,
      bank_name: payload.bank_name || userInfo.bank_name,
      bank_username: payload.bank_username || userInfo.bank_username,
      bank_account_number:
        payload.bank_account_number || userInfo.bank_account_number,
      date_of_birth: payload.date_of_birth || userInfo.date_of_birth,
      updated_at: now(),
    };

    const [data] = await updateUserByIdQuery(userInfo.id, pay);
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

const changePasswordUserById = async (user, payload) => {
  try {
    const id = user.id;
    const [userInfo] = await getUserByIdQuery(id);
    if (!userInfo) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "User does not exist",
        errors: "User does not exist",
      });
    }

    const hashedPassword = userInfo.password;
    if (!(await argon2.verify(hashedPassword, payload.old_password))) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Incorrect Password, think and try again",
        errors: "Incorrect Password, think and try again",
      });
    }

    if (payload.new_password.length < 6) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please use a strong password atleast 6 characters long",
        errors: "Please use a strong password atleast 6 characters long",
      });
    }

    if (payload.new_password !== payload.confirm_new_password) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Confirm Password must be the same with new password",
        errors: "Confirm Password must be the same with new password",
      });
    }

    const verifiedPassword = await argon2.hash(payload.new_password);

    const pay = {
      password: verifiedPassword || userInfo.password,
      updated_at: now(),
    };

    const [data] = await changePasswordByUserIdQuery(userInfo.id, pay);
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
  signUpOrganization,
  verifyEmail,
  loginUser,
  updateUserById,
  changePasswordUserById,
};
