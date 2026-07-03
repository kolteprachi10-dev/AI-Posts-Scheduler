const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateCaption = async (req, res) => {

    try {

        const { title, platform } = req.body;

        const prompt = `
Generate a professional social media caption.

Topic: ${title}

Platform: ${platform}

Requirements:

- Around 80-120 words
- Professional
- Attractive
- Add relevant emojis
- End with 5 hashtags.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.json({
            success: true,
            caption: response.text
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Gemini Error"
        });

    }

};

module.exports = {
    generateCaption
};