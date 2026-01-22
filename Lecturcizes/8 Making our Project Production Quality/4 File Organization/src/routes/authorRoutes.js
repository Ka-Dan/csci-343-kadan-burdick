const express = require("express");
const router = express.Router();
const { validateAuthor } = require("../middleware/recordValidation");
const controller = require("../controllers/authorsController");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", [validateAuthor], controller.create);
router.put("/:id", [validateAuthor], controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;