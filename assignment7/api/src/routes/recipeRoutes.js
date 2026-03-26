const express = require("express");
const router = express.Router();
const { validateRecipe } = require("../middleware/recordValidation");
const controller = require("../controllers/recipesController");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", [ validateRecipe ], controller.create);
router.put("/:id", [ validateRecipe ], controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;