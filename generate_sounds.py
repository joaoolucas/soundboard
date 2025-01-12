import torch
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
import os

def generate_sound(prompt, duration, output_path):
    model = MusicGen.get_pretrained('small')
    model.set_generation_params(duration=duration)
    
    wav = model.generate([prompt])
    
    audio_write(
        output_path,
        wav[0].cpu(),
        model.sample_rate,
        strategy="loudness",
        loudness_compressor=True
    )

# Create sounds directory
os.makedirs('sounds', exist_ok=True)

# Generate each sound
sounds = {
    'rain': "ambient rain sounds, gentle rainfall on city streets, looping seamless",
    'neon': "electric humming and buzzing of neon signs, cyberpunk atmosphere",
    'sirens': "distant futuristic police sirens echoing through city streets",
    'hovercars': "futuristic hover vehicles passing by with whooshing sounds"
}

for name, prompt in sounds.items():
    generate_sound(
        prompt=prompt,
        duration=10,  # 10 seconds
        output_path=f"sounds/{name}"
    ) 