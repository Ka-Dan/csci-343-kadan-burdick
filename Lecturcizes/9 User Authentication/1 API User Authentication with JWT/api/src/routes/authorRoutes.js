const express = require("express");
const router = express.Router();
const controller = require("../controllers/authorsController");

const { validateAuthor } = require("../middleware/recordValidation");
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.use(authenticate);
router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", [authorizeAdmin, validateAuthor], controller.create);
router.put("/:id", [authorizeAdmin, validateAuthor], controller.update);
router.delete("/:id", authorizeAdmin, controller.destroy);

module.exports = router;