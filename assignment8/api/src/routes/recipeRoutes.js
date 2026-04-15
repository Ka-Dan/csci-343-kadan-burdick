const express = require("express");
const router = express.Router();
const { validateRecipe } = require("../middleware/recordValidation");
const controller = require("../controllers/recipesController");
const { authenticate, authorizeRecipeOwner } = require('../middleware/auth');

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", [ authenticate, validateRecipe ], controller.create);
router.put("/:id", [ authenticate, validateRecipe ], controller.update);
router.delete("/:id", [ authenticate ], controller.destroy);

module.exports = router;