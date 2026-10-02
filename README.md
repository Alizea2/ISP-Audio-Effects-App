# Audio Effects App

A browser-based audio effects workstation built with **p5.js** and **p5.sound**. Pick a pre-recorded sound, run it through a chain of four effects, compare the input and output frequency spectrums live, and record the processed result as a WAV file.

Exercise 1 of an Intelligent Signal Processing course.

## Features

- **Pre-recorded sounds library**: six sounds to choose from
- **Playback controls**: Play/Pause, Stop, Loop, Skip to start and a master volume slider
- **Effects chain**: sound → low-pass filter → waveshaper distortion → dynamic compressor → reverb → output

| Effect | Parameters |
|--------|------------|
| **Low-pass filter** | Cutoff frequency, Resonance |
| **Waveshaper distortion** | Distortion amount, Oversample |
| **Dynamic compressor** | Attack, Ratio, Knee, Threshold, Release |
| **Reverb** | Duration, Decay rate, Reverse |

  Each effect has a **DW** slider (dry/wet, the value of the selected parameter) and an **OL** slider (output level).
- **Spectrum In / Spectrum Out**: live FFT views of the original and processed sound side by side
- **Recording**: **Record New** captures the processed audio, saves it to the library and downloads it as a `.wav` file
- **Effect presets**: **Save** stores the current effect settings for the selected sound, **Edit** loads them back, **Delete** removes them, and **Clear filters** resets everything

## How to use

1. Click a **Sound** in the library, then **Play**.
2. In an effect box, click a parameter button (for example **Cutoff freq**), then move its **DW** slider to change it. Use **OL** to set that effect's volume.
3. Watch **Spectrum In** and **Spectrum Out** to see how the effect changes the sound.
4. While the sound is playing, click **Record New** to start recording and click it again to stop. The recording downloads as a WAV file.

## Running the App

The app loads sound files, so it has to be served over a local web server. Opening `index.html` directly from the file system won't work.

### Quick start (one command)

**Step 1:** Run this command in the terminal first. It downloads the project from GitHub into a temporary folder and starts a local web server:

```bash
D=$(mktemp -d) && gh repo clone Alizea2/ISP-Audio-Effects-App "$D" && cd "$D" && python3 -m http.server 8000
```

**Step 2:** Once the terminal shows `Serving HTTP on ... port 8000`, click this link to open the app in your browser:

**<http://localhost:8000>**

Keep the terminal open while you use it. When you're done, press `Ctrl + C` in the terminal to stop the server.

> This needs the [GitHub CLI](https://cli.github.com/) (`gh`) signed in to an account that can access this repository, and Python 3.

### Other ways to run it

From inside the project folder:

**VS Code:** install the *Live Server* extension, right-click `index.html`, and choose **Open with Live Server**.

**Python:** run `python3 -m http.server 8000`, then open <http://localhost:8000>.

## Project Structure

| File / Folder | Purpose |
|---------------|---------|
| `index.html` | Page layout: sounds library, spectrums, playback and the effects panel |
| `style.css` | Styling |
| `sketch.js` | p5.js setup and draw loop |
| `AudioManager.js` | Loading sounds, playback, master volume and recording |
| `EffectsChain.js` | Builds the effects chain and maps the DW and OL sliders to effect parameters |
| `SpectrumAnalyzer.js` | FFT analysis and drawing of the input and output spectrums |
| `SoundLibrary.js` | Stores saved effect settings and recordings |
| `UIController.js` | Connects all the buttons and sliders to the app logic |
| `sound/` | The six pre-recorded sounds |
| `libraries/` | p5.js and p5.sound |

## Related exercises

- [ISP-Audio-Captcha-Voice-Control](https://github.com/Alizea2/ISP-Audio-Captcha-Voice-Control): Exercise 2
- [ISP-Audio-Steganography](https://github.com/Alizea2/ISP-Audio-Steganography): Exercise 3
- [ISP-Airport-Speech-Recognition](https://github.com/Alizea2/ISP-Airport-Speech-Recognition): Exercise 4

## Author

[@Alizea2](https://github.com/Alizea2)
