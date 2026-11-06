const fs = require("fs");
const path = require("path");

const brand = "Future Tech Africa";

const topics = [
  {
    category: "Programming",
    topic: "What is JavaScript?",
    hook: "Did you know JavaScript powers millions of websites?",
    explanation: "JavaScript makes websites interactive and can also power servers, apps and games.",
    cta: "Follow Future Tech Africa to learn coding."
  },
  {
    category: "Artificial Intelligence",
    topic: "What is AI?",
    hook: "AI is changing the world faster than you think!",
    explanation: "Artificial intelligence allows computers to perform tasks that normally require human intelligence.",
    cta: "Follow us for practical AI tips."
  },
  {
    category: "Cybersecurity",
    topic: "How phishing works",
    hook: "One fake message could put your account at risk!",
    explanation: "Phishing tricks people into revealing passwords or personal information through fake messages.",
    cta: "Share this video and learn to stay safe."
  },
  {
    category: "Web Development",
    topic: "What is an API?",
    hook: "How do two different apps communicate?",
    explanation: "An API allows different software systems to exchange information and work together.",
    cta: "Follow us for more technology lessons."
  },
  {
    category: "Mobile Technology",
    topic: "How smartphones work",
    hook: "Your phone is more powerful than you think!",
    explanation: "Smartphones combine processors, memory, sensors and software to perform many tasks.",
    cta: "Follow us for more tech facts."
  },
  {
    category: "Robotics",
    topic: "What is a robot?",
    hook: "Robots are already changing how people work!",
    explanation: "Robots are machines programmed to perform tasks automatically or with human guidance.",
    cta: "Follow Future Tech Africa for more."
  },
  {
    category: "African Technology",
    topic: "How mobile money changed Africa",
    hook: "Africa helped transform how the world sends money!",
    explanation: "Mobile money makes it possible to send, receive and manage money using a phone.",
    cta: "Share this lesson with someone."
  },
  {
    category: "Digital Skills",
    topic: "What is cloud computing?",
    hook: "Your files can live beyond your phone!",
    explanation: "Cloud computing lets people store data and use computing services over the internet.",
    cta: "Follow us to learn digital skills."
  },
  {
    category: "Programming",
    topic: "What is Python?",
    hook: "You can use Python to build powerful applications!",
    explanation: "Python is a beginner-friendly programming language used in automation, AI and web development.",
    cta: "Follow us to learn programming."
  },
  {
    category: "Cybersecurity",
    topic: "Why strong passwords matter",
    hook: "Is your password protecting your accounts?",
    explanation: "Strong, unique passwords make it harder for attackers to access your accounts.",
    cta: "Share this important security tip."
  },
  {
    category: "Artificial Intelligence",
    topic: "How AI chatbots work",
    hook: "How can a computer answer your questions?",
    explanation: "AI chatbots use trained models to understand prompts and generate helpful responses.",
    cta: "Follow us for more AI lessons."
  },
  {
    category: "Web Development",
    topic: "What is HTML?",
    hook: "Every website needs a structure!",
    explanation: "HTML provides the basic structure and content of web pages.",
    cta: "Follow us to learn web development."
  },
  {
    category: "Mobile Technology",
    topic: "What is 5G?",
    hook: "What makes 5G different from 4G?",
    explanation: "5G is a mobile network technology designed to provide faster data speeds and lower latency.",
    cta: "Follow us for more technology facts."
  },
  {
    category: "African Technology",
    topic: "Technology in African farming",
    hook: "Technology is helping farmers grow smarter!",
    explanation: "Digital tools can help farmers monitor crops, weather and market prices.",
    cta: "Share this African technology story."
  },
  {
    category: "Digital Skills",
    topic: "What is digital marketing?",
    hook: "Businesses can reach customers using the internet!",
    explanation: "Digital marketing uses online platforms to promote products and connect with customers.",
    cta: "Follow us for practical digital skills."
  },
  {
    category: "Robotics",
    topic: "How sensors help robots",
    hook: "How does a robot know what is around it?",
    explanation: "Sensors help robots detect objects, movement, distance and changes in their environment.",
    cta: "Follow us for more robotics lessons."
  }
];

function generateVideos() {
  const date = new Date().toISOString().slice(0, 10);
  const folder = path.join(__dirname, "..", "scripts");
  const historyFile = path.join(folder, "topic-history.json");

  fs.mkdirSync(folder, { recursive: true });

  let history = [];

  if (fs.existsSync(historyFile)) {
    try {
      history = JSON.parse(fs.readFileSync(historyFile, "utf8"));
    } catch {
      history = [];
    }
  }

  const available = topics.filter(video => !history.includes(video.topic));

  if (available.length < 4) {
    console.log("Topic library completed. Starting a fresh rotation!");
    history = [];
  }

  const remaining = topics.filter(video => !history.includes(video.topic));

  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }

  const selected = remaining.slice(0, 4);

  selected.forEach((video, index) => {
    const content = `
${brand}
Daily Video ${index + 1}
Date: ${date}

CATEGORY: ${video.category}
TOPIC: ${video.topic}

HOOK:
${video.hook}

EXPLANATION:
${video.explanation}

CALL TO ACTION:
${video.cta}

FORMAT: Vertical 9:16
TARGET LENGTH: 10–15 seconds
PRESENTER: 3D male technology educator
`;

    const filename = `video-${index + 1}-${date}.txt`;

    fs.writeFileSync(path.join(folder, filename), content.trim());

    console.log(`Created: ${filename} — ${video.topic}`);
    history.push(video.topic);
  });

  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

  console.log("\nFour fresh video scripts created successfully!");
}

generateVideos();
