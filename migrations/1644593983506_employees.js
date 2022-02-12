/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {};

exports.down = (pgm) => {};
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("employees", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "The Unique id of a user",
    },
    company_id: {
      type: "uuid",
      notNull: true,
      references: 'organizations("id")',
      comment: "The Unique id of the employee's company",
    },
    department_id: {
      type: "uuid",
      notNull: true,
      references: 'departments("id")',
      comment: "The Unique id of the employee's department",
    },
    unit_id: {
      type: "uuid",
      notNull: true,
      references: 'units("id")',
      comment: "The Unique id of the employee's unit",
    },
    first_name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The first name of a user",
    },
    last_name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The last name of a user",
    },
    phonenumber: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The phone number of a user",
    },
    email: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The email of a user",
    },
    gender: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The gender of an employee",
    },
    job_title: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The role of an employee",
    },
    appointment: {
      type: "VARCHAR(250)",
      comment: "The appointment of an employee",
    },
    status: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The status of an employee => active, archived or leave",
    },
    address: {
      type: "VARCHAR(250)",
      comment: "The address of the employee",
    },
    city: {
      type: "VARCHAR(250)",
      comment: "The city where address is located",
    },
    state: {
      type: "VARCHAR(250)",
      comment: "The state where address is located",
    },
    country: {
      type: "VARCHAR(250)",
      comment: "The country where address is located",
    },

    school: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The school employee attended",
    },
    degree: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The employee's degree",
    },
    grade: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The employee's degree grade",
    },
    resume: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The employee's resume url",
    },
    bank_name: {
      type: "VARCHAR(250)",
      comment: "The bank name of an employee",
    },
    bank_account_number: {
      type: "VARCHAR(250)",
      comment: "The bank account number of an employee",
    },
    bank_username: {
      type: "VARCHAR(250)",
      comment: "The bank username of an employee",
    },
    date_of_birth: {
      type: "DATE",
      notNull: true,
      comment: "The date of birth of an employee",
    },
    // NEXT OF KIN HERE
    next_of_kin_first_name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The first name of Next Of Kin",
    },
    next_of_kin_last_name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The last name of Next Of Kin",
    },
    next_of_kin_phonenumber: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The phone number of Next Of Kin",
    },
    next_of_kin_email: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The email of Next Of Kin",
    },
    next_of_kin_gender: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The gender of Next Of Kin",
    },
    next_of_kin_date_of_birth: {
      type: "DATE",
      notNull: true,
      comment: "The date of birth of Next Of Kin",
    },
    next_of_kin_address: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The address of the Next Of Kin",
    },
    next_of_kin_city: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The city where address is located",
    },
    next_of_kin_state: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The state where address is located",
    },
    next_of_kin_country: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The country where address is located",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      comment: "When the user created the account",
    },
    updated_at: {
      type: "timestamp",
      default: null,
      comment: "When the user updated an info on the account",
    },
    deleted_at: {
      type: "timestamp",
      default: null,
      comment: "When the user deleted their account",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("employees", {
    ifExists: true,
  });
};
