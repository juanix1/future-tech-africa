import subprocess
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGE = ROOT / "images/tech-mzee-reference.png"
DRUMS = ROOT / "videos/african-drums.wav"
VIDEOS = ROOT / "videos"

def duration(file):
    result = subprocess.check_output([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(file)
    ], text=True)
    return float(result.strip())

def main():
    if not IMAGE.exists() or not DRUMS.exists():
        print("Missing Tech Mzee image or African drums.")
        return

    voices = sorted(VIDEOS.glob("video-*-????-??-??.mp3"))

    if not voices:
        print("No generated voice files found.")
        return

    for voice in voices:
        seconds = duration(voice)
        frames = math.ceil(seconds * 24)
        output = VIDEOS / (voice.stem + ".mp4")

        command = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(IMAGE),
            "-i", str(voice),
            "-stream_loop", "-1", "-i", str(DRUMS),
            "-filter_complex",
            f"[0:v]scale=1200:2100,zoompan=z='min(zoom+0.0005,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1080x1920:fps=24,trim=duration={seconds},setpts=PTS-STARTPTS[v];[1:a]volume=1[voice];[2:a]volume=0.18,atrim=duration={seconds}[music];[voice][music]amix=inputs=2:duration=first[a]",
            "-map", "[v]", "-map", "[a]",
            "-t", str(seconds),
            "-c:v", "libx264", "-preset", "ultrafast",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            str(output)
        ]

        print(f"\nCreating {output.name}...")
        subprocess.run(command, check=True)
        print(f"Finished: {output.name}")

    print("\nALL VIDEOS CREATED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
