// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import { clerkMiddleware, requireAuth } from "@clerk/express";
// import aiRouter from "./routes/aiRoutes.js";
// import connectCloudinary from "./configs/cloudinary.js";
// import userRouter from "./routes/userRoutes.js";
// import axios from "axios";

// const app = express();

// await connectCloudinary();

// app.use(cors());
// app.use(express.json());
// app.use(clerkMiddleware());



// // Public route
// app.get("/", (req, res) => res.send("Server is Live!"));

// // PROTECTED ROUTES (Require Clerk Auth)
// app.use("/api/ai", requireAuth(), aiRouter);
// app.use("/api/user", requireAuth(), userRouter);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });








import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import axios from "axios";

const app = express();

await connectCloudinary();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());
// Document Converter routes (public)
app.use("/api/convert", documentRoutes);

// --- Chatbot Logic (Proxy to Python FastAPI) ---
// We place this in a route so your React app can call it
app.post("/api/chatbot/ask", async (req, res) => {
  try {
    const { question } = req.body;

    // Call your Python FastAPI server (running on port 8000)
    const pythonResponse = await axios.post("http://127.0.0.1:8000/ask", {
      question: question,
    });

    // Send the result back to your React frontend
    res.json(pythonResponse.data);
  } catch (error) {
    console.error("Error communicating with Python AI:", error.message);
    res.status(500).json({ error: "AI Service is currently unavailable." });
  }
});

// Update Knowledgebase Route
app.post("/api/chatbot/update-db", requireAuth(), async (req, res) => {
  try {
    const pythonResponse = await axios.post("http://127.0.0.1:8000/update-db");
    res.json(pythonResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to update Knowledgebase." });
  }
});
// ------------------------------------------------

// Public route
app.get("/", (req, res) => res.send("Server is Live!"));

// PROTECTED ROUTES (Require Clerk Auth)
app.use("/api/ai", requireAuth(), aiRouter);
app.use("/api/user", requireAuth(), userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});