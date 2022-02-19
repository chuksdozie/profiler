var express = require("express");
var router = express.Router();
var httpStatus = require("http-status");
const { isLoggedIn } = require("../middlewares/index");

const {
  addNewEmployee,
  getAllEmployees,
  updateEmployeeById,
} = require("../controllers/employee");
const { updateEmployeeByIdQuery } = require("../queries");

/* add new employee */
router.post("/add", async function (req, res, next) {
  try {
    const {
      company_id,
      department_id,
      //   unit_id,
      first_name,
      last_name,
      middle_name,
      phonenumber,
      email,
      gender,
      avatar,
      job_title,
      appointment,
      status,
      address,
      city,
      state,
      country,
      school,
      degree,
      grade,
      resume,
      bank_name,
      bank_account_number,
      bank_username,
      date_of_birth,
      next_of_kin_first_name,
      next_of_kin_last_name,
      next_of_kin_phonenumber,
      next_of_kin_email,
      next_of_kin_gender,
      next_of_kin_relationship,
      next_of_kin_date_of_birth,
      next_of_kin_address,
      next_of_kin_city,
      next_of_kin_state,
      next_of_kin_country,
    } = req.body;
    const data = await addNewEmployee({
      company_id,
      department_id,
      //   unit_id,
      first_name,
      last_name,
      middle_name,
      phonenumber,
      email,
      gender,
      avatar,
      job_title,
      appointment,
      status,
      address,
      city,
      state,
      country,
      school,
      degree,
      grade,
      resume,
      bank_name,
      bank_account_number,
      bank_username,
      date_of_birth,
      next_of_kin_first_name,
      next_of_kin_last_name,
      next_of_kin_phonenumber,
      next_of_kin_email,
      next_of_kin_gender,
      next_of_kin_relationship,
      next_of_kin_date_of_birth,
      next_of_kin_address,
      next_of_kin_city,
      next_of_kin_state,
      next_of_kin_country,
    });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (req, res) => {
  try {
    const data = await getAllEmployees();
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
    return;
  }
});

router.put("/update/:id", isLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const {
      department_id,
      first_name,
      last_name,
      middle_name,
      phonenumber,
      email,
      gender,
      avatar,
      job_title,
      appointment,
      status,
      address,
      city,
      state,
      country,
      school,
      degree,
      grade,
      resume,
      bank_name,
      bank_account_number,
      bank_username,
      date_of_birth,
      next_of_kin_first_name,
      next_of_kin_last_name,
      next_of_kin_phonenumber,
      next_of_kin_email,
      next_of_kin_gender,
      next_of_kin_relationship,
      next_of_kin_date_of_birth,
      next_of_kin_address,
      next_of_kin_city,
      next_of_kin_state,
      next_of_kin_country,
    } = req.body;
    const data = await updateEmployeeById(id, {
      department_id,
      first_name,
      last_name,
      middle_name,
      phonenumber,
      email,
      gender,
      avatar,
      job_title,
      appointment,
      status,
      address,
      city,
      state,
      country,
      school,
      degree,
      grade,
      resume,
      bank_name,
      bank_account_number,
      bank_username,
      date_of_birth,
      next_of_kin_first_name,
      next_of_kin_last_name,
      next_of_kin_phonenumber,
      next_of_kin_email,
      next_of_kin_gender,
      next_of_kin_relationship,
      next_of_kin_date_of_birth,
      next_of_kin_address,
      next_of_kin_city,
      next_of_kin_state,
      next_of_kin_country,
    });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
