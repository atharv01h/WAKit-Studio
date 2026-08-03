<div align="center">
  <img src="https://img.shields.io/badge/WAKit-Studio-10b981?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WAKit Studio Logo" />
  <h1>WAKit Studio</h1>
  <p><strong>A beautiful, stateless, node-based visual builder for WhatsApp bots.</strong></p>
</div>

---

## 🌟 Overview

**WAKit Studio** is a cutting-edge visual builder designed specifically for creating WhatsApp bots powered by the open-source [`@atharvh01/wakit`](https://github.com/atharvh01/wakit) library. 

Say goodbye to manually writing complex conversational routing logic! With WAKit Studio, you can drag and drop nodes onto a vast canvas, connect triggers to actions, simulate conversations live, and instantly **export a fully functional Node.js bot project** in a single click.

## ✨ Features

- **🎨 Gorgeous Glassmorphic UI**: Built with TailwindCSS and ReactFlow, featuring a sleek dark mode, glowing accents, and satisfying micro-animations.
- **📱 Live Simulator**: Test your bot's logic instantly. Type a message in the built-in simulated smartphone and watch your bot traverse the node tree and respond in real-time.
- **📦 1-Click ZIP Export**: Generates a complete, production-ready Node.js project containing your `package.json`, `tsconfig.json`, and the fully transpiled `index.ts` bot script.
- **🔄 Stateless Execution Engine**: The compiler strictly generates stateless, highly-optimized conditional routing, ensuring your bot can scale to thousands of users without memory leaks.
- **🗂️ Ready-Made Templates**: Jumpstart your project with built-in templates including a massive E-Commerce bot, an advanced Support Desk, an Interactive Quiz, and a Scheduled Meme sender!
- **💾 Local Persistence**: Automatically saves your workspace locally so you never lose your progress.

## 🧩 Available Nodes

WAKit Studio provides a robust palette of nodes to handle any conversational flow:

- ⚡ **Trigger Node**: Fires a flow when a user sends a message starting with a specific keyword.
- ❓ **Catch-All (Fallback)**: Executes when a user's message matches NO other triggers.
- 💬 **Text Node**: Sends a standard (or multi-line) text response.
- 🖼️ **Media Node**: Sends images or videos with optional captions via URL.
- 📊 **Poll Node**: Generates native WhatsApp polls with single-choice options.
- ⏳ **Wait (Delay) Node**: Simulates human typing delays by pausing execution for a specified number of milliseconds.
- 🔀 **Condition Node**: Branches your flow into `True` or `False` paths based on whether the user's message contains specific keywords.
- 🛡️ **Rate Limit Node**: A global configuration node that applies strict rate-limiting middleware to prevent spam.
- ⏰ **Cron Node**: Schedules recurring background tasks (e.g., daily announcements) using standard CRON expressions.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:atharv01h/WAKit-Studio.git
   cd WAKit-Studio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the studio in your browser at `http://localhost:5173`.

## 🛠️ How to use the exported Bot

When you click **Export ZIP**, WAKit Studio generates a `wakit-bot.zip` archive. 
1. Extract the ZIP to a new folder.
2. Open a terminal in that folder and run:
   ```bash
   npm install
   npm start
   ```
3. Scan the QR code with your WhatsApp app on your phone to link the bot.
4. Your bot is now live and running the exact logic you built in the visual studio!

## 👨‍💻 Creator

Created by **Atharv Hatwar**.
Check out the core WhatsApp library repository: [WAKit on GitHub](https://github.com/atharvh01/wakit)

---
<div align="center">
  <sub>Built with React, ReactFlow, Vite, and TailwindCSS.</sub>
</div>
