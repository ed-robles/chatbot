export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const API_KEY = process.env.API_KEY;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5",
      messages: [
        {
          role: "user",
          content: req.body.message,
        },
        {
          role: "system",
          content:
            "Users are expected to submit random questions, one at a time. Responses should never be longer than 4 sentences. Don't go past 50 words. If the user asks for a list, provide a list of no more than 5 items.",
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
