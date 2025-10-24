

<details open>
<summary>💻🤖 <b>Full-Stack Buddy — AI-Powered Code Generator</b></summary>

---

> **“Your AI-powered companion for full-stack code generation — from one prompt to a complete project.”**

---

### 🌟 Overview

**Full-Stack Buddy** is an AI-powered development assistant that instantly generates **Frontend**, **Backend**, or **Full-Stack** solutions from a single prompt.  
It helps developers prototype faster, streamline workflows, and reduce the context-switching pain between frontend and backend tasks.  

🧠 Built for developers who want:
- Integrated frontend + backend code generation.
- A clean UI for viewing code and explanations.
- Secure API key management with persistent settings.

---

### ✨ Features

| Category | Description |
|-----------|--------------|
| 🧩 **Full-Stack Code Generation** | Generate structured code for **Frontend**, **Backend**, or **Full-Stack** apps from a single prompt. |
| ⚛️ **Frontend UI** | Built with **React + TypeScript**, modular components, and syntax highlighting using `react-syntax-highlighter`. |
| 🛠️ **Backend Service** | Node.js/Express integration to handle Gemini API requests securely. |
| 🔑 **API Key Manager** | Enter, view, update, or clear Gemini API keys with validation and localStorage persistence. |
| 🗂️ **Tabbed Code Display** | Organized tabs for **Overview**, **Backend**, and **Frontend** with syntax highlighting. |
| 💾 **Persistent Settings** | Local storage ensures user preferences and API keys are saved securely. |

---

### 🧭 App Navigation Flow

```plaintext
                         │   Full-Stack Buddy App 💻🤖  │
                         └─────────────┬───────────────┘
                                       │
                          ┌────────────┴─────────────┐
                          │     Navigation Bar 🧭     │
                          │  Tabs:                   │
                          │  Generate ⚡ • Refactor 🔧 │
                          │  Explain 📝 • Tests ✅    │
                          │  Docs 📚 • Instructions 📂 │
                          └────────────┬─────────────┘
                                       │
      ┌───────────────────────────────┼───────────────────────────────┐
      │                               │                               │
┌─────▼─────┐                 ┌──────▼────────┐               ┌──────▼────────┐
│ Generate ⚡ │                 │ Instructions 📂│              │ Coming Soon 🌟│
│ Backend 🛠️ │                 │ Setup guide 📝 │              │ Refactor, Explain, │
│ Frontend 🎨│                 │ & Steps 🧩     │              │ Tests, Docs 🔧     │
│ Full-Stack 🧩│                └───────────────┘              └──────────────────┘
└─────┬─────┘
      │
┌─────▼─────────┐
│ Gemini API 🤖  │
│ Receives prompt│
│ Returns JSON   │
│ {overview📖, backend🛠️, frontend🎨} │
└─────┬─────────┘
```


⸻

🧱 Architecture

<details>
<summary>🖥️ Frontend Stack 🎨</summary>


	•	React ⚛️
	•	TypeScript 🖌️
	•	CSS Modules 💅
	•	Styled Components 🎨
	•	React Syntax Highlighter 📜
	•	LocalStorage for persistence 💾

</details>


<details>
<summary>🛠️ Backend Stack</summary>


	•	Node.js 🖥️
	•	Express 🧩
	•	Gemini API integration 🤖

</details>


<details>
<summary>☁️ Cloud & Hosting</summary>


	•	Netlify ⚡ (Frontend Hosting)
	•	Firebase 🔐 (Auth & Realtime DB)
	•	AWS 🏔️ (S3, Lambda, API Gateway)
	•	GCP 🌏 (Vertex AI, Firestore)
	•	Azure 💠 (Functions, Cosmos DB)
	•	DigitalOcean 🌊, Heroku 🚀

</details>


<details>
<summary>🗄️ Databases & Storage</summary>


	•	MongoDB 🍃
	•	PostgreSQL 🐘
	•	MySQL 🐬
	•	Redis 🔴
	•	RabbitMQ 🐇

</details>


<details>
<summary>⚙️ Dev Tools & CI/CD</summary>


	•	VSCode 💻
	•	npm / yarn 📦
	•	Git & GitHub 🔗
	•	Postman / Insomnia 🧪
	•	Docker 🐳
	•	Kubernetes ☸️
	•	GraphQL 🕸️
	•	REST API 🌐

</details>



⸻

🗂️ File & Directory Structure

```
Full-Stack-Buddy/
│
├── components/
│   ├── ApiKeyManager.tsx
│   ├── ComingSoonView.tsx
│   ├── FunctionTabs.tsx
│   ├── GenerationTypeSelector.tsx
│   ├── Header.tsx
│   ├── Loader.tsx
│   ├── PromptInput.tsx
│   └── ResponseDisplay.tsx
│
├── services/
│   └── geminiService.ts
│
├── App.tsx
├── index.html
├── index.tsx
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```


⸻

⚡ How It Works
	1.	Enter your task or idea 🧠
→ Example: “Build a login page with Node.js backend and React frontend.”
	2.	Select generation type 🧩
→ Backend Only 🛠️, Frontend Only 🎨, or Full-Stack 🧩
	3.	Gemini API generates structured JSON 🤖
→ { overview, backend, frontend }
	4.	View results in tabs 🗂️
→ Overview 📝, Backend 🛠️, Frontend 🎨 with syntax highlighting 🌈
	5.	Secure API Key management 🔑
→ Enter or update Gemini key (masked, validated, and saved in localStorage)

⸻

🔐 API Key Manager

Feature	Description
🔑 Input Gemini API key	Enter and validate directly in the app.
👀 Masked Display	Keeps key hidden unless toggled.
💾 Local Persistence	Saved securely in browser localStorage.
❌ Clear Function	Remove or reset key anytime.
🧩 Validation	Checks for correct key format before sending API requests.


⸻

💡 Coming Soon

Feature	Description
📂 Code Export	Download generated frontend/backend as runnable files.
🧰 Template Library	Node.js, Django, Flask, React, Vue, etc.
👀 Live Preview	Real-time rendering of generated frontend UI.
☁️ Cloud Storage	Save prompts and outputs with account authentication.
🏢 Enterprise Mode	Encrypted key storage & team collaboration.


⸻

🧑‍💻 Usage Example

// Example usage of geminiService
import { generateCode } from './services/geminiService';

const handleGenerate = async () => {
  const prompt = "Create a Flask API with a React frontend for todo management.";
  const response = await generateCode(prompt, "fullstack");
  console.log(response.overview, response.backend, response.frontend);
};


⸻

🧾 License

This project is licensed under the MIT License — feel free to use, modify, and distribute.

⸻

🧡 Made With

Technology	Emoji
React	⚛️
TypeScript	🖌️
Node.js	🖥️
Express	🛠️
Gemini API	🤖
CSS Modules	💅
Netlify	⚡


⸻

🚀 Full-Stack Buddy — because one smart prompt deserves a full-stack solution.

⸻


</details>
```



⸻
