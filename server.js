
const express = require("express");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const database = path.join(__dirname, "data", "videos.json");

app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve dashboard files
app.use(express.static(path.join(__dirname, "public")));

// Read video database
function getVideos() {
  const data = JSON.parse(
    fs.readFileSync(database, "utf8")
  );

  return data.videos || [];
}

// Server status
app.get("/api/status", (req, res) => {
  res.json({
    project: "Future Tech Africa",
    status: "online",
    message: "Dashboard server is working",
    storage: "Cloudinary"
  });
});

// Get all videos
app.get("/api/videos", (req, res) => {
  try {
    const videos = getVideos().map(video => {
      const localAvailable =
        video.file && fs.existsSync(video.file);

      const cloudAvailable =
        Boolean(video.cloudinaryUrl);

      return {
        id: video.id,
        title: video.title,
        category: video.category,
        date: video.date,
        status: video.status,

        fileAvailable:
          cloudAvailable || localAvailable,

        videoUrl:
          video.cloudinaryUrl ||
          `/api/videos/${encodeURIComponent(video.id)}/file`
      };
    });

    res.json(videos);

  } catch (error) {
    console.error("Video loading error:", error.message);

    res.status(500).json({
      error: "Could not load videos"
    });
  }
});

// Stream or redirect to an individual video
app.get("/api/videos/:id/file", (req, res) => {
  try {
    const video = getVideos().find(
      v => v.id === req.params.id
    );

    if (!video) {
      return res.status(404).send("Video not found");
    }

    // Use Cloudinary when available
    if (video.cloudinaryUrl) {
      return res.redirect(302, video.cloudinaryUrl);
    }

    // Otherwise use the local video file
    if (video.file && fs.existsSync(video.file)) {
      return res.sendFile(video.file);
    }

    return res.status(404).send("Video file not found");

  } catch (error) {
    console.error("Video streaming error:", error.message);

    res.status(500).send("Could not stream video");
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("-----------------------------------");
  console.log("FUTURE TECH AFRICA");
  console.log("Dashboard server running");
  console.log(`Port: ${PORT}`);
  console.log("Video storage: Cloudinary");
  console.log("-----------------------------------");
});
