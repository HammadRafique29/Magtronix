#  **Magtronix** 🚀 Local AI Automation - Electron & Python

## 🔥 Introduction
Local AI Automation is an upcoming **powerful desktop application** designed to bring **AI-driven automation** to your local system. Unlike cloud-based services like **Make.com**, this tool will run entirely on your machine using **Electron, Python, and Docker**, ensuring complete privacy, security, and performance.

This repository is currently being prepared to provide project details, updates, and insights before deployment. Stay tuned for the official release! 🚀

## 🎯 Key Features (Planned)
- **AI-Powered Automation** – Integrate multiple AI tools into a single app
- **Chatbot** – Locally hosted chatbot for seamless conversations
- **Ollama WebUI** – A powerful AI interface for managing Ollama models
- **Heygen Automation** – Automate Heygen video creation workflows
- **TTS & Whisper** – Convert text to speech and transcribe audio effortlessly
- **Image Generation** – Generate AI-driven images locally
- **Scenario-Based Automation** – Create workflows and automate repetitive tasks
- **Server Scheduling** – Schedule tasks to run on your local server even when offline

## 🛠️ Tech Stack
- **Frontend:** Electron.js (for cross-platform desktop UI)
- **Backend:** Python (for AI processing and automation tasks)
- **Containerization:** Docker (to keep everything modular and isolated)

## 🛠️ Installation
- Install Docker
- Install Ollama
- Install NPM, Node
- Install Python3.11.9
- Download <a href="https://drive.google.com/file/d/1HwEfMDmuNTqKxiLnsGssa6oib3pzVpEx/view?usp=sharing" target="_blank">ffmpeg.7z</a></span> and ADD TO PATH [Windows]

## ⚙️ Configuration
- Add Docker on Startup
- Add Ollama on Startup

## 🐳 Installation Using Docker
- `docker pull ghcr.io/open-webui/open-webui:main`
- `docker pull ghcr.io/coqui-ai/tts:latest`

## 📥 Pulling Ollama Models
- llama3.2:1b       [Ollama - Optional]
- deepseek-r1:1.5b  [Ollama - Optional]

## 🚀 First Time Execution
- python3 app.py
- ollama serve [make sure to add Ollama on startup]

## 🔄 Normal Execution
- Run runner.py
- Run Magtronix

## 👨‍💻 For Developers
- Run  `[ python3 -m venv venv ]`
- Run  `[ source venv/bin/activate ,  ./venv/Scripts/activate ]`
- Run  `[ pip install -r requirements.txt ]`
- Run  `[ pip install --upgrade pip setuptools wheel ]`
- Run  `[ python3 app.py ]`

## 📷 App Screenshots
We have been working hard on the UI, and here are some early previews:

![1740994205165](https://github.com/user-attachments/assets/10cf2b40-0f83-4bfd-8574-ccf37a0ca3cd)
![1740994197637](https://github.com/user-attachments/assets/f11ff3da-2a2a-4b39-9238-882f8923fca8)
![1740994205864](https://github.com/user-attachments/assets/f94b0faf-81bb-40f9-b2c4-d0640489ff1e)
![1740994203158](https://github.com/user-attachments/assets/57d38b50-7532-4aa7-8dec-302bd4cd2f89)

## 📢 Stay Tuned
This project is actively in development. **A dashboard preview will be shared soon!** 👀

Follow this repository for updates and be the first to experience **AI-driven automation on your local system!** 🚀

