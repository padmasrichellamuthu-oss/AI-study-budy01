const express = require("express");
const auth = require("../controllers/middleware/auth");
const {
  summarizeMaterial,
  generateFlashcards,
  generateQuiz,
  generateStudyPlan,
  getMyResources,
} = require("../controllers/aiController");

const router = express.Router();

router.get("/resources", auth, getMyResources);
router.post("/study-plan", auth, generateStudyPlan);
router.post("/:id/summarize", auth, summarizeMaterial);
router.post("/:id/flashcards", auth, generateFlashcards);
router.post("/:id/quiz", auth, generateQuiz);

module.exports = router;