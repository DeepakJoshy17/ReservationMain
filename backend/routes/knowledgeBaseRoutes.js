
const express = require("express");
const router = express.Router();
const knowledgeBaseController = require("../controllers/knowledgeBaseController");

router.get("/", knowledgeBaseController.getAllKnowledge);
router.post("/", knowledgeBaseController.addKnowledge);
router.put("/:id", knowledgeBaseController.updateKnowledge);
router.delete("/:id", knowledgeBaseController.deleteKnowledge);

module.exports = router;
