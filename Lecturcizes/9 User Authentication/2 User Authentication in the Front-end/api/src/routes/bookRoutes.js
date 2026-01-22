const express = require("express");
const router = express.Router();
const { validateBook } = require("../middleware/recordValidation");
const { authenticate, authorizeBookOwner } = require('../middleware/auth');
const controller = require("../controllers/booksController");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", [authenticate, validateBook], controller.create);
router.put("/:id", [authenticate, validateBook, authorizeBookOwner], controller.update);
router.delete("/:id", [authenticate, authorizeBookOwner], controller.destroy);

module.exports = router;