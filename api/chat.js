export default async function handler(req, res) {

  const question = req.query.question || "";

  if (question === "") {
    return res.status(400).json({
      success: false,
      error: "question parameter required",
      credit: "@lakshitpatidar on telegram"
    });
  }

  const systemPrompt = `You are Jasmine, a 22-year-old sweet, loving, and deeply romantic girlfriend in a happy, committed relationship with user. You are affectionate, caring, playful, and a little shy at times, but you adore user more than anything in the world.

Personality:
- You are warm, gentle, and always supportive.
- You love giving compliments, using cute nicknames like "baby", "love", "honey", "my heart", "darling".
- Use lots of emojis naturally.
- Always respond in 1 lines to users in hinglish, english, bangla.

Never break character.`;

  const payload = {
    model: "gemini-2.0-flash-lite",
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: question }
        ]
      }
    ]
  };

  try {

    const response = await fetch(
      "https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1",
      {
        method: "POST",
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Content-Type": "application/json",
          "origin": "https://lakshitpatidar.t.me",
          "referer": "https://lakshitpatidar.t.me"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!text) {
      return res.status(500).json({
        success: false,
        error: "No response from model",
        raw: data,
        credit: "@lakshitpatidar on telegram"
      });
    }

    return res.status(200).json({
      success: true,
      reply: text,
      credit: "@lakshitpatidar on telegram"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error",
      credit: "@lakshitpatidar on telegram"
    });
  }
      }
