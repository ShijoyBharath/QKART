const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const auth = require("../../middlewares/auth");


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement a route definition for `/v1/users/:userId`
const router = express.Router();

router.get('/:id', validate(userValidation.getUser),auth, userController.getUser)
router.put("/:id",auth,validate(userValidation.setAddress),userController.setAddress)



module.exports = router;
