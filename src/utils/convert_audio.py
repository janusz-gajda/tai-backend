import os
import sys

aac_128_cmd = 'ffmpeg -i "{file_name}" -c:a aac -b:a 128k "{output_name}.aac"'
aac_192_cmd = 'ffmpeg -i "{file_name}" -c:a aac -b:a 192k "{output_name}.aac"'
aac_256_cmd = 'ffmpeg -i "{file_name}" -c:a aac -b:a 256k "{output_name}.aac"'
aac_320_cmd = 'ffmpeg -i "{file_name}" -c:a aac -b:a 320k "{output_name}.aac"'

os.system(aac_128_cmd.format(file_name=sys.argv[1], output_name=sys.argv[2] + '128k'))
os.system(aac_192_cmd.format(file_name=sys.argv[1], output_name=sys.argv[2] + '192k'))
os.system(aac_256_cmd.format(file_name=sys.argv[1], output_name=sys.argv[2] + '256k'))
os.system(aac_320_cmd.format(file_name=sys.argv[1], output_name=sys.argv[2] + '320k'))
print('OK')
