import asyncio
import re
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"
OUTPUT = ROOT / "videos"
VOICE = "en-KE-ChilembaNeural"

async def main():
    files = list(SCRIPTS.glob("video-*-????-??-??.txt"))

    if not files:
        print("No dated video scripts found.")
        return

    latest_date = max(
        re.search(r"(\d{4}-\d{2}-\d{2})\.txt$", f.name).group(1)
        for f in files
    )

    today_files = [
        f for f in files if f.name.endswith(latest_date + ".txt")
    ]

    OUTPUT.mkdir(exist_ok=True)

    for file in sorted(today_files):
        content = file.read_text(encoding="utf-8")

        sections = re.search(
            r"HOOK:\s*(.*?)\s*EXPLANATION:\s*(.*?)\s*CALL TO ACTION:\s*(.*?)(?:FORMAT:|$)",
            content,
            re.S
        )

        if not sections:
            print(f"Skipped: {file.name}")
            continue

        spoken_text = " ".join(part.strip() for part in sections.groups())
        output_file = OUTPUT / (file.stem + ".mp3")

        communicate = edge_tts.Communicate(spoken_text, VOICE)
        await communicate.save(str(output_file))

        print(f"Voice created: {output_file.name}")

    print("Voice generation complete!")

asyncio.run(main())
