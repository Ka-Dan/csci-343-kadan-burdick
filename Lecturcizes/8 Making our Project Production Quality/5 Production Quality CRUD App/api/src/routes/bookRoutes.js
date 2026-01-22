const express = require("express");
const router = express.Router();
const { validateBook } = require("../middleware/recordValidation");
const controller = require("../controllers/booksController");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", [validateBook], controller.create);
router.put("/:id", [validateBook], controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;