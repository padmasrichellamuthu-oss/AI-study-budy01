const Material = require("../Material");

async function createMaterial(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title-um study content-um thevai",
      });
    }

    const material = await Material.create({
      user: req.user.id,
      title,
      content,
    });

    res.status(201).json({
      message: "Study material save aayiduchu",
      material,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function uploadTextMaterial(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: ".txt file select pannunga" });
    }

    const content = req.file.buffer.toString("utf8");
    const title =
      req.body.title || req.file.originalname.replace(/\.txt$/i, "");

    const material = await Material.create({
      user: req.user.id,
      title,
      content,
    });

    res.status(201).json({
      message: "Text file upload aagi save aayiduchu",
      material,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMaterials(req, res) {
  try {
    const materials = await Material.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ materials });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createMaterial, uploadTextMaterial, getMaterials };