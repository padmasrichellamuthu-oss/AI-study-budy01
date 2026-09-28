const Material = require("../Material");
const Resource = require("../Resource");
const {
  createSummary,
  createFlashcards,
  createQuiz,
  createStudyPlan,
} = require("./utils/gemini");

async function findUserMaterial(req, res) {
  const material = await Material.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!material) {
    res.status(404).json({ message: "Study material kidaikkala" });
    return null;
  }

  return material;
}

async function summarizeMaterial(req, res) {
  try {
    const material = await findUserMaterial(req, res);
    if (!material) return;

    const summary = await createSummary(material.content);

    await Resource.create({
      user: req.user.id,
      material: material._id,
      type: "summary",
      content: summary,
    });

    res.json({ message: "Summary ready", title: material.title, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function generateFlashcards(req, res) {
  try {
    const material = await findUserMaterial(req, res);
    if (!material) return;

    const flashcards = await createFlashcards(material.content);

    await Resource.create({
      user: req.user.id,
      material: material._id,
      type: "flashcards",
      content: flashcards,
    });

    res.json({ message: "Flashcards ready", title: material.title, flashcards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function generateQuiz(req, res) {
  try {
    const material = await findUserMaterial(req, res);
    if (!material) return;

    const quiz = await createQuiz(material.content);

    await Resource.create({
      user: req.user.id,
      material: material._id,
      type: "quiz",
      content: quiz,
    });

    res.json({ message: "Quiz ready", title: material.title, quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function generateStudyPlan(req, res) {
  try {
    const { topics, examDate, hoursPerDay } = req.body;

    if (!topics || !examDate || !hoursPerDay) {
      return res.status(400).json({
        message: "Topics, exam date, daily study hours thevai",
      });
    }

    const studyPlan = await createStudyPlan(topics, examDate, hoursPerDay);

    await Resource.create({
      user: req.user.id,
      material: null,
      type: "study-plan",
      content: studyPlan,
    });

    res.json({ message: "Study plan ready", studyPlan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getMyResources(req, res) {
  try {
    const resources = await Resource.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ resources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  summarizeMaterial,
  generateFlashcards,
  generateQuiz,
  generateStudyPlan,
  getMyResources,
};