const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const scriptsDir = path.join(root, "scripts");
const databasePath = path.join(root, "data/videos.json");

const database = JSON.parse(fs.readFileSync(databasePath, "utf8"));

const files = fs.readdirSync(scriptsDir)
  .filter(file => /^video-\d+-\d{4}-\d{2}-\d{2}\.txt$/.test(file));

for (const file of files) {
  const match = file.match(/^video-(\d+)-(\d{4}-\d{2}-\d{2})\.txt$/);
  const [, number, date] = match;

  const content = fs.readFileSync(path.join(scriptsDir, file), "utf8");

  const category = content.match(/^CATEGORY:\s*(.+)$/m)?.[1]?.trim();
  const title = content.match(/^TOPIC:\s*(.+)$/m)?.[1]?.trim();

  const videoPath = path.join(
    root, "library", "ready", date,
    `video-${number}-${date}.mp4`
  );

  if (!category || !title || !fs.existsSync(videoPath)) {
    console.log(`Skipped: ${file} (missing details or video)`);
    continue;
  }

  const alreadyRegistered = database.videos.some(
    video => video.file === videoPath
  );

  if (alreadyRegistered) {
    console.log(`Already registered: ${title}`);
    continue;
  }

  database.videos.push({
    id: `video-${number}-${date}`,
    title,
    category,
    date,
    status: "ready",
    file: videoPath
  });

  console.log(`Registered: ${title}`);
}

fs.writeFileSync(databasePath, JSON.stringify(database, null, 2) + "\n");

console.log(`\nDatabase now contains ${database.videos.length} video(s).`);
