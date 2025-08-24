const path = require("path");
const fs = require("fs");
const logger = require("../../config/winstonLoggerConfig");

const getImage = async (req, res, next) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // Construct the file path to uploads folder
    const uploadsDir = path.join(__dirname, "../../uploads");

    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Get file stats
    const stats = fs.statSync(filePath);

    // Check if it's a file (not directory)
    if (!stats.isFile()) {
      return res.status(400).json({ error: "Invalid file" });
    }

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";

    switch (ext) {
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".pdf":
        contentType = "application/pdf";
        break;
      default:
        contentType = "application/octet-stream";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "public, max-age=31536000");

    // ✅ CORS fix for <img>, <Image> components to load image from another origin
    res.setHeader("Access-Control-Allow-Origin", "*"); // Or use exact domain like "http://localhost:3000"
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getImage,
};
