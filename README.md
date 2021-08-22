# algaphon
Algaphon - Remote algae aquarium connected to web experience

***Web module:***
**Function:** Records audio from the visitors and sends to a google drive (Harpreet's xLab account < setup as test account for a )
Will be pushed to github pages.

***Arduino Module:***
**Function:** 6500k LED strip whose intensity is controlled through a power transistor.
1. Solder the circuit as per the schematic in the folder. Attach the LED strips. 2 LED strips are needed per aquarium. 
2. Open the code in the Arduino IDE and upload.
3. Note the port name.
4. Test the functionality using serial monitor. [Send 'a' for lowest intensity, 'e' for highest and other characters b/w a-e etc.]

***NodeJS Module***
***Function*: **
1. To process the audio files coming in from exhibition visitors, find peaks in audio every 0.5s, 
2. Map the peaks to light intensities
2. Rename files to tag them as done to take them out of global queue
Note: All computers (Tokyo x 1, NY x 2) can directly operate on the audio files coming in from visitors without having to figure out manually what is done and what is not. 

**To run:**
1. Install NodeJS on your computer
2. Download the repo and cd into the directory of repo using terminal.
3. npm i in the terminal to install dependencies
4. Download Google drive. Use Harpreet's xLab account to sync the **gdrive-visitorrecording** folder in the directory with the nodejs files (i.e. within aquariumnode folder)
5. Manually create a 'postprocessed-manualsync' folder. 
6. If not passing the port using command line arguments, open runlights.js and change portName var to reflect the actual port on your computer. If not known, use **type ls /dev/tty*** in terminal to find serial portname of your arduino in MacOS
7. After installation of dependencies, run program using node runlights.js
_Note: _
All files coming in from visitors can have different amplitudes, mic intensities etc. Instead of doing automatic adaptive amplification, use Audacity to amplify these wav files manually. 
Open Audacity, import the visitor audio file from the '**.gdrive-visitorrecording**' folder (where the files are coming in automatically from around the world)
If needed, amplify the sound file in audacity.
Export the file as .wav and save in the '**postprocessed-manualsync**'  folder. 
