/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("units", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "The Unique id of a departments unit",
    },
    name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The name of the department",
    },
    description: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The logo of the organization",
    },
    company_id: {
      type: "uuid",
      notNull: true,
      references: 'organizations("id")',
      comment: "The Unique id of the company",
    },
    department_id: {
      type: "uuid",
      notNull: true,
      references: 'departments("id")',
      comment: "The Unique id of the unit's department",
    },
    email: {
      type: "VARCHAR(250)",
      unique: true,
      comment: "The email of an department",
    },
    phonenumber: {
      type: "VARCHAR(250)",
      comment: "The phone number of the department",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      comment: "When the department created the account",
    },
    updated_at: {
      type: "timestamp",
      default: null,
      comment: "When the department updated an info on the account",
    },
    deleted_at: {
      type: "timestamp",
      default: null,
      comment: "When the department deleted their account",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("units", {
    ifExists: true,
  });
};
