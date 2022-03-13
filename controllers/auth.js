const {
  signUpOrganizationQuery,
  getAllOrganizationsQuery,
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

const emailVerificationSetup = (email) => {
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

    const emailSetUp = await emailVerificationSetup(payload.email);

    const orgEmail = await getOrganizationByEmailQuery(payload.email);
    const orgName = await getOrganizationByNameQuery(payload.name);

    if (orgName.length) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "This Company Name is already in use",
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
    sendMail(
      emailSetUp.reciever,
      emailSetUp.mailSubject,
      emailSetUp.mailContent
    );
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

const getAllOrganizations = async () => {
  try {
    const data = await getAllOrganizationsQuery();
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const loginOrganization = async (payload) => {
  try {
    if (!payload.email) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please insert an Email Address",
        errors: "Email Address not provided",
      });
    }
    const [organization] = await getOrganizationByEmailQuery(payload.email);

    if (!organization) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "This email address does not exist, please sign up instead.",
        errors: "Email does not exists",
      });
    }

    if (!organization.verified) {
      // THIS IS TO GENERATE VERIFICATION LINK
      const emailSetUp = await emailVerificationSetup(payload.email);

      sendMail(
        emailSetUp.reciever,
        emailSetUp.mailSubject,
        emailSetUp.mailContent
      );
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please verify your account. Check your Email Address",
        errors: "Email Address not verified",
      });
    }
    const password = await payload.password;
    const hashedPassword = await organization.password;

    if (await argon2.verify(hashedPassword, password)) {
      const token = jwt.sign(
        {
          id: organization.id,
          email: organization.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );

      const pay = {
        name: payload.name || organization.name,
        description: payload.description || organization.description,
        phonenumber: payload.phonenumber || organization.phonenumber,
        logo: payload.logo || organization.logo,
        address: payload.address || organization.address,
        city: payload.city || organization.city,
        state: payload.state || organization.state,
        country: payload.country || organization.country,
        logged_at: now(),
        updated_at: organization.updated_at,
      };

      const [data] = await updateOrganizationByIdQuery(organization.id, pay);

      const { password, ...rest } = data;
      return { ...rest, token };
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

const updateOrganizationById = async (id, payload) => {
  try {
    const [organization] = await getOrganizationByIdQuery(id);
    console.log(6786, organization);
    if (!organization) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Organization does not exist",
        errors: "Organization does not exist",
      });
    }

    const pay = {
      name: payload.name || organization.name,
      description: payload.description || organization.description,
      phonenumber: payload.phonenumber || organization.phonenumber,
      logo: payload.logo || organization.logo,
      address: payload.address || organization.address,
      city: payload.city || organization.city,
      state: payload.state || organization.state,
      country: payload.country || organization.country,
      logged_at: organization.logged_at,
      updated_at: now(),
    };
    console.log(4645, pay);
    const [data] = await updateOrganizationByIdQuery(id, pay);
    return data;
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
  loginOrganization,
  getAllOrganizations,
  updateOrganizationById,
  changePasswordUserById,
};
