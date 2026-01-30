const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const attributeController = require("./attribute.controller");

router.post('/add', authMiddleware, attributeController.add);
router.get('/details', authMiddleware, attributeController.details);
module.exports = router;
