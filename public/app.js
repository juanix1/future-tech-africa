async function loadDashboard() {
  const container = document.getElementById("videos");
  container.textContent = "Loading videos...";

  try {
    const response = await fetch("/api/videos");

    if (!response.ok) throw new Error("Could not load videos");

    const videos = await response.json();

    document.getElementById("total").textContent = videos.length;
    document.getElementById("ready").textContent =
      videos.filter(v => v.status === "ready").length;
    document.getElementById("published").textContent =
      videos.filter(v => v.status === "published").length;
    document.getElementById("archived").textContent =
      videos.filter(v => v.status === "archived").length;

    container.replaceChildren();

    videos.forEach(video => {
      const card = document.createElement("article");
      card.className = "video-card";

      const title = document.createElement("h3");
      title.textContent = video.title;

      const category = document.createElement("p");
      category.textContent = "Category: " + video.category;

      const date = document.createElement("p");
      date.textContent = "Created: " + video.date;

      const status = document.createElement("span");
      status.className = "status";
      status.textContent = video.status.toUpperCase();

      card.append(title, category, date, status);

      if (video.fileAvailable) {
        const playButton = document.createElement("button");
        playButton.textContent = "▶ Play Preview";
        playButton.style.marginTop = "12px";

        playButton.addEventListener("click", () => {
          if (card.querySelector("video")) return;

          const preview = document.createElement("video");
          preview.src = video.videoUrl;
          preview.controls = true;
          preview.preload = "metadata";
          preview.playsInline = true;
          preview.style.width = "100%";
          preview.style.marginTop = "12px";
          preview.style.borderRadius = "8px";

          card.appendChild(preview);
          playButton.textContent = "Preview loaded";
          preview.load();
        });

        card.appendChild(playButton);
      } else {
        const missing = document.createElement("p");
        missing.textContent = "Video file unavailable.";
        card.appendChild(missing);
      }

      container.appendChild(card);
    });

  } catch (error) {
    container.textContent = "Error: " + error.message;
  }
}

loadDashboard();
