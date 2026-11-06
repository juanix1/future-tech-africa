const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const { recordPublication } = require("./publishing");
const { showDashboard } = require("./dashboard");

const root = path.join(__dirname, "../..");
const library = path.join(root, "library");
const databasePath = path.join(root, "data/videos.json");
const historyPath = path.join(root, "data/publishing-history.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function loadDatabase() {
  return JSON.parse(fs.readFileSync(databasePath, "utf8"));
}

function saveDatabase(database) {
  fs.writeFileSync(databasePath, JSON.stringify(database, null, 2) + "\n");
}

function showVideos() {
  const database = loadDatabase();

  console.log("\n========== VIDEO LIBRARY ==========");

  for (const status of ["ready", "published", "archive"]) {
    const videos = database.videos.filter(v => v.status === status);

    console.log(`\n${status.toUpperCase()}: ${videos.length} video(s)`);

    videos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title} [${video.status}]`);
      console.log(`   Category: ${video.category}`);
      console.log(`   Date: ${video.date}`);
    });
  }

  console.log("\n===================================");
}

async function moveVideo(destinationStatus) {
  const database = loadDatabase();
  const sources = destinationStatus === "published"
    ? ["ready"]
    : ["ready", "published"];

  const videos = database.videos.filter(v => sources.includes(v.status));

  if (!videos.length) {
    console.log("No eligible videos found.");
    return;
  }

  console.log("\nSELECT A VIDEO:");

  videos.forEach((video, index) => {
    console.log(`${index + 1}. ${video.title} [${video.status}]`);
  });

  const choice = Number(await rl.question("\nVideo number (0 to cancel): "));

  if (!Number.isInteger(choice) || choice < 0 || choice > videos.length) {
    console.log("Invalid selection.");
    return;
  }

  if (choice === 0) {
    console.log("Cancelled.");
    return;
  }

  const video = videos[choice - 1];
  const oldPath = video.file;

  if (!fs.existsSync(oldPath)) {
    console.log("Video file not found. Nothing was changed.");
    return;
  }

  const relativePath = path.relative(
    path.join(library, video.status),
    oldPath
  );

  const newPath = path.join(library, destinationStatus, relativePath);

  if (fs.existsSync(newPath)) {
    console.log("Destination already exists. Nothing was changed.");
    return;
  }

  const confirm = await rl.question(
    `Move "${video.title}" to ${destinationStatus}? (y/n): `
  );

  if (confirm.trim().toLowerCase() !== "y") {
    console.log("Cancelled.");
    return;
  }

  fs.mkdirSync(path.dirname(newPath), { recursive: true });
  fs.renameSync(oldPath, newPath);

  video.file = newPath;
  video.status = destinationStatus;

  saveDatabase(database);

  console.log(`SUCCESS: ${video.title} is now ${destinationStatus}.`);
}

function showHistory() {
  const history = JSON.parse(fs.readFileSync(historyPath, "utf8"));

  console.log("\n========== PUBLISHING HISTORY ==========");

  if (history.publications.length === 0) {
    console.log("No publications recorded yet.");
  }

  history.publications.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.title}`);
    console.log(`   Platform: ${item.platform}`);
    console.log(`   Published: ${item.publishedAt}`);
    console.log(`   URL: ${item.url}`);
    console.log(`   Status: ${item.status}`);
  });

  console.log("\n========================================");
}

async function recordExistingPublication() {
  const database = loadDatabase();
  const videos = database.videos.filter(v => ["ready", "published"].includes(v.status));

  if (!videos.length) {
    console.log("No ready videos available.");
    return;
  }

  console.log("\nSELECT A VIDEO TO RECORD ONLINE:");

  videos.forEach((video, index) => {
    console.log(`${index + 1}. ${video.title} [${video.status}]`);
  });

  const choice = Number(await rl.question("\nVideo number (0 to cancel): "));

  if (!Number.isInteger(choice) || choice < 0 || choice > videos.length) {
    console.log("Invalid selection.");
    return;
  }

  if (choice === 0) {
    console.log("Cancelled.");
    return;
  }

  const video = videos[choice - 1];
  const success = await recordPublication(video);

  if (success) {
    console.log("Publication history saved.");
    console.log("Use option 2 to move the video to Published.");
  }
}

async function main() {
  for (const folder of ["ready", "published", "archive"]) {
    fs.mkdirSync(path.join(library, folder), { recursive: true });
  }

  console.log("\n================================");
  console.log("       FUTURE TECH AFRICA");
  console.log("          VIDEO MANAGER");
  console.log("================================");

  let running = true;

  while (running) {
    console.log("\n1. View all videos");
    console.log("2. Publish a video (move to Published)");
    console.log("3. Archive a video");
    console.log("4. Exit");
    console.log("5. View publishing history");
    console.log("6. Record an existing publication");
    console.log("7. Main dashboard");

    const choice = await rl.question("\nChoose an option: ");

    switch (choice.trim()) {
      case "1": showVideos(); break;
      case "2": await moveVideo("published"); break;
      case "3": await moveVideo("archive"); break;
      case "4":
        running = false;
        console.log("Video Manager closed.");
        break;
      case "5": showHistory(); break;
      case "6": await recordExistingPublication(); break;
      case "7": showDashboard(); break;
      default: console.log("Invalid option.");
    }
  }

  rl.close();
}

main().catch(error => {
  console.error("Manager error:", error.message);
  rl.close();
});
