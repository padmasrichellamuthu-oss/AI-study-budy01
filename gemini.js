const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function createSummary(studyContent) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `Summarize these study notes in clear, simple language. Keep the key concepts and use bullet points:\n\n${studyContent}`,
  });

  return response.text;
}

async function createFlashcards(studyContent) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `Create 5 study flashcards from these notes. For each card, show a Question and its Answer. Use simple language:\n\n${studyContent}`,
  });

  return response.text;
}

async function createQuiz(studyContent) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `Create 5 multiple-choice quiz questions from these notes. Give 4 options (A, B, C, D) and mark the correct answer for each. Use simple language:\n\n${studyContent}`,
  });

  return response.text;
}

async function createStudyPlan(topics, examDate, hoursPerDay) {
  // Today-oda date-a local calendar-la edukkum.
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );

  // Exam date YYYY-MM-DD format-la irukkanum.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(examDate || "");

  if (!match) {
    throw new Error("Exam date YYYY-MM-DD format-la kudunga.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const exam = new Date(Date.UTC(year, month - 1, day));

  // Invalid calendar date-a check pannum.
  if (
    exam.getUTCFullYear() !== year ||
    exam.getUTCMonth() !== month - 1 ||
    exam.getUTCDate() !== day
  ) {
    throw new Error("Valid exam date kudunga.");
  }

  const daysLeft = Math.round(
    (exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft <= 0) {
    throw new Error("Future exam date kudunga.");
  }

  const todayText = today.toISOString().slice(0, 10);

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `Create a practical study plan.

Topics: ${topics}
Today's date: ${todayText}
Exam date: ${examDate}
Number of available study days before the exam: ${daysLeft}
Available study time per day: ${hoursPerDay} hours

Rules:
- Make exactly ${daysLeft} study days.
- Start on ${todayText} and finish the day before the exam.
- Put the correct calendar date beside every study day.
- Keep each day's study within ${hoursPerDay} hours.
- Include practice and revision days.
- Do not make a 28-day, 45-day, or 51-day plan unless that exact number of days is available.
- Do not include dates before today or after the day before the exam.
- Use simple language and clear bullet points.`,
  });

  return response.text;
}

module.exports = {
  createSummary,
  createFlashcards,
  createQuiz,
  createStudyPlan,
};