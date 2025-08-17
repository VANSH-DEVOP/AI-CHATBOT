import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"] })); // frontend

// 🔑 Groq API key (store in .env instead of hardcoding!)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// test endpoint
app.get("/", (_, res) => res.send("✅ Groq Chatbot API is running"));

// chat endpoint
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",  // You can also try "llama3-70b-8192"
      messages: messages,
      temperature: 0.7,
      max_tokens: 200,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("❌ Groq API Error:", err);
    res.status(500).json({ error: "Groq API call failed" });
  }
});

app.listen(8787, () =>
  console.log("🚀 Backend running at http://localhost:8787")
);
