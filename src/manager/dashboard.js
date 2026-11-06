const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const databasePath = path.join(root, "data/videos.json");
const historyPath = path.join(root, "data/publishing-history.json");

function showDashboard() {
  const database = JSON.parse(fs.readFileSync(databasePath, "utf8"));
  const history = JSON.parse(fs.readFileSync(historyPath, "utf8"));

  const videos = database.videos;
  const publications = history.publications;

  const ready = videos.filter(v => v.status === "ready").length;
  const published = videos.filter(v => v.status === "published").length;
  const archived = videos.filter(v => v.status === "archive").length;

  const platforms = ["YouTube", "TikTok", "Facebook", "Instagram"];

  console.log("\n======================================");
  console.log("       FUTURE TECH AFRICA");
  console.log("          MAIN DASHBOARD");
  console.log("======================================");

  console.log(`\nTotal videos created: ${videos.length}`);
  console.log(`Ready for publishing: ${ready}`);
  console.log(`Published videos: ${published}`);
  console.log(`Archived videos: ${archived}`);

  console.log("\n--- PUBLICATIONS BY PLATFORM ---");

  platforms.forEach(platform => {
    const count = publications.filter(
      p => p.platform.toLowerCase() === platform.toLowerCase()
    ).length;

    console.log(`${platform}: ${count}`);
  });

  console.log("\nTotal publication records: " + publications.length);

  console.log("\n======================================");
}

module.exports = { showDashboard };
