const express = require("express");
const router = express.Router();
const { validateCategory } = require("../middleware/recordValidation");
const controller = require("../controllers/categoriesController");
const { authenticate } = require("../middleware/auth");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", [ authenticate, validateCategory], controller.create);
router.put("/:id", [ authenticate, validateCategory], controller.update);
router.delete("/:id", [ authenticate ], controller.destroy);

module.exports = router;