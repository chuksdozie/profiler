var express = require("express");
var router = express.Router();
var httpStatus = require("http-status");
const { isLoggedIn } = require("../middlewares/index");

const {
  addNewDepartment,
  getAllDepartments,
  updateDepartmentById,
} = require("../controllers/department");

/* add new department */
router.post("/add", async function (req, res, next) {
  try {
    const { name, description, company_id, email, phonenumber } = req.body;
    const data = await addNewDepartment({
      name,
      description,
      company_id,
      email,
      phonenumber,
    });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (req, res) => {
  try {
    const data = await getAllDepartments();
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
    const { name, description, email, phonenumber } = req.body;
    const data = await updateDepartmentById(id, {
      name,
      description,
      email,
      phonenumber,
    });
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
