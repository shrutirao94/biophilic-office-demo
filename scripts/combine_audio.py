from pydub import AudioSegment
import os

def combine_audio_files(input_folder, output_file):
    files = sorted(os.listdir(input_folder))
    combined = AudioSegment.empty()
    
    for file in files:
        if file.endswith(".wav"):
            file_path = os.path.join(input_folder, file)
            print(f"Adding {file_path}")
            sound = AudioSegment.from_wav(file_path)
            combined += sound

    combined.export(output_file, format="wav")
    print(f"Exported combined file: {output_file}")

base_folder = "sounds-1"
combine_audio_files(os.path.join(base_folder, "bird"), os.path.join(base_folder, "bird.wav"))
combine_audio_files(os.path.join(base_folder, "office"), os.path.join(base_folder, "office.wav"))
combine_audio_files(os.path.join(base_folder, "wind"), os.path.join(base_folder, "wind.wav"))

