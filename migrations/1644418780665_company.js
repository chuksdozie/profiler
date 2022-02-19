/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("organizations", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      unique: true,
      unique: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "The Unique id of a company",
    },
    name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The name of the organization",
    },
    description: {
      type: "VARCHAR(500)",
      unique: false,
      comment: "The description of the description",
    },
    email: {
      type: "VARCHAR(250)",
      notNull: true,
      unique: true,
      comment: "The email of an organization",
    },
    password: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The password of the organization",
    },
    phonenumber: {
      type: "VARCHAR(250)",
      unique: true,
      comment: "The phone number of the organization",
    },
    logo: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The logo of the organization",
    },
    address: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The address of the employee",
    },
    city: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The city where address is located",
    },
    state: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The state where address is located",
    },
    country: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The country where address is located",
    },
    verified: {
      type: "BOOL",
      notNull: true,
      default: false,
      comment: "The company email has been verified or not",
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      comment: "When the organiztion created the account",
    },
    updated_at: {
      type: "timestamp",
      default: null,
      comment: "When the organiztion updated an info on the account",
    },
    logged_at: {
      type: "timestamp",
      default: null,
      comment: "When the organiztion logged in latest",
    },
    deleted_at: {
      type: "timestamp",
      default: null,
      comment: "When the organiztion deleted their account",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("organizations", {
    ifExists: true,
  });
};
