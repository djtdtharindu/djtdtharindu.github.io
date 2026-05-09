# VoxWave - Text to Speech App 🎙️

VoxWave is a beautifully designed, modern web application that transforms written text into natural-sounding speech using your browser's native Web Speech API. 

It works entirely on the client-side, making it incredibly fast, completely private, and functional even when you are offline!

## ✨ Features

- **Premium UI/UX:** Stunning dark-mode glassmorphism interface with smooth animations and dynamic particle backgrounds.
- **Native Web Speech API:** Uses your device's built-in voices to synthesize high-quality speech without needing external backend APIs.
- **Real-Time Controls:** Adjust speed, pitch, and volume on the fly. The speech will seamlessly adapt mid-sentence.
- **MP3 Audio Export:** Instantly download your generated text-to-speech audio as an MP3 file (powered by StreamElements / Amazon Polly).
- **Progressive Web App (PWA):** Fully offline-capable! Install VoxWave directly to your desktop or mobile home screen and use it without an internet connection.
- **History Tracking:** Automatically saves your recently spoken text snippets to local storage so you never lose them.
- **Interactive Visualizer:** Real-time animated waveform visualizer reacting to the playback status.

## 🚀 How to Run Locally

Because VoxWave is a pure client-side web application, it does not require a complex backend.

1. Clone this repository to your local machine.
2. Open the project folder.
3. Simply launch a local HTTP server. For example, if you have Python installed, you can run:
   ```bash
   python -m http.server 8080
   ```
4. Open your browser and navigate to `http://localhost:8080`!

*(Note: While you can theoretically double-click `index.html` to open it in a browser, some features like Service Workers (PWA offline support) require the app to be served over `http://` or `https://` instead of `file://` to function correctly.)*

## 🛠️ Technology Stack
- HTML5
- CSS3 (Custom Design System, CSS Variables)
- Vanilla JavaScript (ES6)
- Web Speech API (SpeechSynthesis)
- Service Workers (PWA)

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
