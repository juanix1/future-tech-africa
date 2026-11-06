from PIL import Image, ImageDraw

img = Image.open("images/tech-mzee.png").convert("RGB")
draw = ImageDraw.Draw(img)

w, h = img.size

for x in range(0, w, 100):
    draw.line((x, 0, x, h), fill="red", width=1)
    draw.text((x + 3, 3), str(x), fill="yellow")

for y in range(0, h, 100):
    draw.line((0, y, w, y), fill="red", width=1)
    draw.text((3, y + 3), str(y), fill="yellow")

img.save("images/tech-mzee-grid.jpg")
print("Grid image created!")
