import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = "edge";

export async function POST(req: Request) {
  const { topik, platform, tone, detail } = await req.json();

  if (!topik) {
    return new Response(JSON.stringify({ error: "Topik wajib diisi" }), {
      status: 400,
    });
  }

  const platformGuide: Record<string, string> = {
    instagram: "Instagram (max 2200 karakter, pakai emoji, 5-10 hashtag relevan di akhir)",
    tiktok: "TikTok (singkat & hook kuat di kalimat pertama, 3-5 hashtag trending)",
    linkedin: "LinkedIn (profesional, insight bernilai, tanpa emoji berlebihan, 2-3 hashtag)",
    twitter: "Twitter/X (max 280 karakter, padat dan engaging)",
  };

  const toneGuide: Record<string, string> = {
    casual: "santai, akrab, seperti ngobrol sama teman",
    profesional: "profesional, berwibawa, informatif",
    lucu: "lucu, ringan, pakai humor yang natural",
    inspiratif: "inspiratif, memotivasi, menggerakkan pembaca",
  };

  const prompt = `Kamu adalah copywriter profesional Indonesia yang ahli membuat caption media sosial yang viral dan engaging.

Buat 3 variasi caption untuk:
- Platform: ${platformGuide[platform] || platform}
- Topik/Produk: ${topik}
- Tone: ${toneGuide[tone] || tone}
${detail ? `- Detail tambahan: ${detail}` : ""}

Format output:
**Variasi 1 — [nama gaya]**
[caption lengkap]

**Variasi 2 — [nama gaya]**
[caption lengkap]

**Variasi 3 — [nama gaya]**
[caption lengkap]

Buat caption yang terasa natural, bukan kaku atau terlalu formal. Sesuaikan dengan cara orang Indonesia ngomong di media sosial.`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContentStream(prompt);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
