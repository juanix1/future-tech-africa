require("dotenv").config();

const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const root = path.join(__dirname, "..");
const database = path.join(root, "data", "videos.json");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadVideos() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary configuration is incomplete.");
  }

  const data = JSON.parse(fs.readFileSync(database, "utf8"));

  for (const video of data.videos) {
    if (video.cloudinaryUrl) {
      console.log(`Already uploaded: ${video.title}`);
      continue;
    }

    if (!fs.existsSync(video.file)) {
      console.log(`File missing: ${video.title}`);
      continue;
    }

    console.log(`Uploading: ${video.title}`);

    try {
      const result = await cloudinary.uploader.upload(video.file, {
        resource_type: "video",
        folder: "future-tech-africa",
        public_id: video.id,
        overwrite: true
      });

      video.cloudinaryUrl = result.secure_url;
      video.cloudinaryPublicId = result.public_id;

      fs.writeFileSync(
        database,
        JSON.stringify(data, null, 2)
      );

      console.log(`Uploaded successfully: ${video.title}`);
    } catch (error) {
      console.error(`Upload failed: ${video.title}`);
      console.error(error.message);
    }
  }

  console.log("\nCloudinary upload process finished.");
}

uploadVideos();
