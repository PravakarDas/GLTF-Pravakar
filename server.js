import express from 'express';
import cors from 'cors'; // Import cors
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3000;

const apiKey = "AIzaSyD_SyHYr-ZLhl4vfDQqSHmgIGOGp-HJdT8";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static('.')); // Serve static files from the root directory

let chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Hello" }],
        },
        {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
    ],
});

// Endpoint to handle chat messages
app.post('/send', async (req, res) => {
    const userMessage = req.body.message;
    const aiResponse = await sendMessageAndUpdateHistory(userMessage);
    res.json({ reply: aiResponse });
});

// Function to send a message and update chat history
async function sendMessageAndUpdateHistory(message) {
    let result = await chat.sendMessage(message);
    return result.response.text();
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
