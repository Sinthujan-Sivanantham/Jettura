import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { systemContent, prompt } = body;

        const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const groqKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

        // Versuche zuerst Gemini
        if (geminiKey && geminiKey !== 'DEIN_GEMINI_API_KEY_HIER') {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: `${systemContent}\n\n${prompt}` }]
                            }],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 2500,
                                responseMimeType: "application/json"
                            }
                        })
                    }
                );

                const data = await response.json();

                if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    let content = data.candidates[0].content.parts[0].text.trim();
                    const parsed = JSON.parse(content);

                    if (parsed.steps && Array.isArray(parsed.steps)) {
                        return NextResponse.json(parsed);
                    }
                }
            } catch (geminiError) {
                console.error("Gemini failed, falling back to Groq:", geminiError);
            }
        }

        // Fallback zu Groq
        if (!groqKey) {
            return NextResponse.json({ error: "No API Key configured" }, { status: 500 });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${groqKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemContent },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Groq API Error");
        }

        if (!data.choices) throw new Error("No choices from Groq");

        let content = data.choices[0].message.content.trim();

        const firstBracket = content.indexOf('{');
        const lastBracket = content.lastIndexOf('}');
        if (firstBracket === -1 || lastBracket === -1) throw new Error("Kein gültiges JSON gefunden");
        content = content.substring(firstBracket, lastBracket + 1);

        const parsed = JSON.parse(content);
        return NextResponse.json(parsed);

    } catch (err) {
        console.error("AI Planner Backend Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
