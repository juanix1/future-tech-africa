const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const videoFolder = path.join(root, "videos");
const readyFolder = path.join(root, "library", "ready");

fs.mkdirSync(readyFolder, { recursive: true });

const files = fs.readdirSync(videoFolder);

let moved = 0;

for (const file of files) {
  const match = file.match(/^video-\d+-(\d{4}-\d{2}-\d{2})\.mp4$/);

  if (!match) continue;

  const date = match[1];
  const destinationFolder = path.join(readyFolder, date);

  fs.mkdirSync(destinationFolder, { recursive: true });

  const source = path.join(videoFolder, file);
  const destination = path.join(destinationFolder, file);

  if (fs.existsSync(destination)) continue;

  fs.renameSync(source, destination);

  console.log(`Organized: ${file}`);
  moved++;
}

console.log(`\nVideo organization complete. ${moved} video(s) moved.`);
