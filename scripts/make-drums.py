import math, wave, struct, random

rate = 44100
duration = 18.36
audio = [0.0] * int(rate * duration)
random.seed(7)

def drum(time, kind):
    start = int(time * rate)
    length = int(rate * (0.20 if kind == "bass" else 0.10))
    for i in range(length):
        t = i / rate
        if kind == "bass":
            sound = math.sin(2 * math.pi * (95 - 45*t) * t) * math.exp(-18*t)
        elif kind == "slap":
            sound = random.uniform(-1, 1) * math.exp(-35*t)
        else:
            sound = random.uniform(-1, 1) * math.exp(-55*t)
        if start + i < len(audio):
            audio[start+i] += sound * (0.65 if kind != "shaker" else 0.12)

beat = 60 / 105
for bar in range(8):
    base = bar * beat * 4
    drum(base, "bass")
    drum(base + beat, "slap")
    drum(base + beat*2, "bass")
    drum(base + beat*3, "slap")
    for j in range(8):
        drum(base + j*beat/2, "shaker")

with wave.open("videos/african-drums.wav", "w") as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(rate)
    f.writeframes(b"".join(
        struct.pack("<h", int(max(-1, min(1, x*0.65))*32767))
        for x in audio
    ))

print("Original African-inspired drum beat created!")
