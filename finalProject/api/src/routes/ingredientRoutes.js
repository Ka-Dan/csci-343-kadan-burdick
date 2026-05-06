const express = require("express");
const router = express.Router();
const controller = require("../controllers/ingredientsController");

router.get("/", controller.index);

module.exports = router;