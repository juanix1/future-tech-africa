const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");

const root = path.join(__dirname, "../..");
const historyPath = path.join(root, "data/publishing-history.json");

const platforms = ["YouTube", "TikTok", "Facebook", "Instagram"];

async function recordPublication(video) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    console.log(`\nRecording publication: ${video.title}`);

    platforms.forEach((platform, index) => {
      console.log(`${index + 1}. ${platform}`);
    });

    const answer = await rl.question("\nChoose platform: ");
    const choice = Number(answer);

    if (
      !Number.isInteger(choice) ||
      choice < 1 ||
      choice > platforms.length
    ) {
      console.log("Invalid platform.");
      return false;
    }

    const platform = platforms[choice - 1];

    const history = JSON.parse(
      fs.readFileSync(historyPath, "utf8")
    );

    const duplicate = history.publications.some(item =>
      item.videoId === video.id &&
      item.platform.toLowerCase() === platform.toLowerCase()
    );

    if (duplicate) {
      console.log(
        `This video is already recorded on ${platform}.`
      );
      return false;
    }

    const url = await rl.question(
      "Paste the published video URL: "
    );

    if (!/^https?:\/\/\S+$/i.test(url.trim())) {
      console.log("A valid http or https URL is required.");
      return false;
    }

    history.publications.push({
      videoId: video.id,
      title: video.title,
      platform,
      publishedAt: new Date().toISOString(),
      url: url.trim(),
      status: "published"
    });

    fs.writeFileSync(
      historyPath,
      JSON.stringify(history, null, 2) + "\n"
    );

    console.log("Publication recorded successfully.");
    return true;

  } catch (error) {
    console.error("Publication error:", error.message);
    return false;
  } finally {
    rl.close();
  }
}

module.exports = { recordPublication };
