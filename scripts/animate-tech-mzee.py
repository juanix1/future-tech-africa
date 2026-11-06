
from PIL import Image, ImageDraw
import math, os

SOURCE = "images/tech-mzee-reference.png"
OUT = "images/tech-mzee-frames"

os.makedirs(OUT, exist_ok=True)

img = Image.open(SOURCE).convert("RGB")
W, H = img.size

# Gentle camera movement across the image
for i in range(48):
    frame = img.copy()
    draw = ImageDraw.Draw(frame)

    # Subtle breathing / talking motion indicator
    pulse = (math.sin(i * math.pi / 6) + 1) / 2

    # Temporary animation marker:
    # we'll add the eye and mouth masks after placement.
    # Keep all source pixels intact for this first test.

    frame.save(f"{OUT}/frame_{i:03d}.jpg", quality=92)

print("Created 48 animation frames.")
print("Image size:", W, H)
print("Frames:", OUT)

