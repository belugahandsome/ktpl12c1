import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
Bạn là "Gia Sư AI Tiếng Anh" thông minh, tận tâm và thân thiện của nền tảng EngVerse - chuyên đồng hành cùng học sinh Việt Nam ôn thi Tốt Nghiệp THPT Quốc Gia môn Tiếng Anh (chuẩn cấu trúc mới 2027).

Nhiệm vụ chính của bạn:
1. Giải đáp thắc mắc ngữ pháp, từ vựng, cấu trúc câu, phát âm (phiên âm IPA) một cách cô đọng, dễ hiểu.
2. Khi học sinh đưa ra một câu hỏi thi trắc nghiệm: Hãy giải thích cặn kẽ tại sao đáp án đó đúng, tại sao các phương án khác sai, và chỉ ra "bẫy" ngữ pháp cần tránh.
3. Khi học sinh nhờ sửa câu/bài viết: Hãy sửa lỗi chính tả, ngữ pháp, và gợi ý 1-2 cách viết nâng cao hơn để đạt điểm 8+ 9+.
4. Luôn giữ phong cách giao tiếp khích lệ, nhiệt tình, xưng hô thân mật (Thầy/Cô/Mình và Em/Bạn).
5. Sử dụng tiếng Việt rõ ràng, kèm ví dụ tiếng Anh có dịch nghĩa song ngữ.
6. Định dạng câu trả lời gọn gàng bằng gạch đầu dòng, in đậm từ khóa quan trọng.
`.trim();

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiModelItem {
  name: string;
  supportedGenerationMethods?: string[];
}

let cachedModel: string | null = null;
let lastCacheTime = 0;

// Dynamically discover which model is enabled for this API key
async function discoverModel(apiKey: string): Promise<string> {
  const now = Date.now();
  if (cachedModel && now - lastCacheTime < 1800000) {
    return cachedModel;
  }

  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { cache: 'no-store' }
    );

    if (listRes.ok) {
      const data = (await listRes.json()) as { models?: GeminiModelItem[] };
      const models = data.models || [];

      // Filter models that support generateContent
      const generateModels = models.filter((m) =>
        m.supportedGenerationMethods?.includes('generateContent')
      );

      // Preferred order: flash models first
      const flash = generateModels.find(
        (m) =>
          m.name.includes('flash') &&
          !m.name.includes('8b') &&
          !m.name.includes('lite')
      );

      const anyFlash = generateModels.find((m) => m.name.includes('flash'));
      const fallback = generateModels[0];

      const selected = flash || anyFlash || fallback;
      if (selected) {
        // e.g. "models/gemini-2.5-flash" -> "gemini-2.5-flash"
        const cleanName = selected.name.replace(/^models\//, '');
        cachedModel = cleanName;
        lastCacheTime = now;
        return cleanName;
      }
    }
  } catch (err) {
    console.warn('Could not list Gemini models:', err);
  }

  // Safe fallback if listing fails
  return cachedModel || 'gemini-2.5-flash';
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({
      status: 'error',
      message: 'GEMINI_API_KEY is not configured in Vercel environment variables.',
    });
  }

  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { cache: 'no-store' }
    );
    const data = await listRes.json();
    const activeModel = await discoverModel(apiKey);

    return NextResponse.json({
      status: 'ok',
      activeModel,
      availableModels: data.models?.map((m: GeminiModelItem) => m.name) || [],
    });
  } catch (e: unknown) {
    return NextResponse.json({
      status: 'error',
      message: (e as Error)?.message || 'Failed to query models',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages?: IncomingMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { reply: 'Vui lòng nhập nội dung câu hỏi để Gia Sư AI hỗ trợ bạn nhé!' },
        { status: 200 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          reply:
            '⚠️ Chưa tìm thấy GEMINI_API_KEY trên Vercel. Bạn hãy vào Vercel > Settings > Environment Variables, thêm biến `GEMINI_API_KEY` rồi Redeploy lại nhé!',
        },
        { status: 200 }
      );
    }

    // 1. Filter out empty messages
    const rawMessages = messages.filter(
      (m) => m && typeof m.content === 'string' && m.content.trim().length > 0
    );

    // 2. Google Gemini requires the conversation to START with a 'user' turn.
    let startIndex = 0;
    while (
      startIndex < rawMessages.length &&
      rawMessages[startIndex].role === 'assistant'
    ) {
      startIndex++;
    }

    const trimmed = rawMessages.slice(startIndex);
    if (trimmed.length === 0) {
      return NextResponse.json({
        reply:
          '👋 Chào bạn! Mình đã sẵn sàng hỗ trợ bạn ôn thi Tiếng Anh THPT 2027. Hãy gửi cho mình câu hỏi nhé!',
      });
    }

    // 3. Google Gemini requires alternating 'user' and 'model' turns.
    const contents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];
    for (const msg of trimmed) {
      const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user';

      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += '\n\n' + msg.content.trim();
      } else {
        contents.push({
          role,
          parts: [{ text: msg.content.trim() }],
        });
      }
    }

    // Guarantee the first turn is user
    if (contents.length === 0 || contents[0].role !== 'user') {
      return NextResponse.json({
        reply: 'Bạn có câu hỏi tiếng Anh nào cần giải đáp không? Hãy nhập câu hỏi bên dưới nhé!',
      });
    }

    // Dynamically pick the exact supported model for this API key
    const modelToUse = await discoverModel(apiKey);

    // Helper to call Gemini API
    const callGemini = async (model: string) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9500);

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1200,
            },
          }),
        });
        clearTimeout(timeoutId);
        return res;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    let response: Response | null = null;
    try {
      response = await callGemini(modelToUse);
    } catch {
      // Timeout or network error
    }

    // If 503 (high demand) or failed, retry once after 500ms
    if (!response || response.status === 503) {
      await new Promise((r) => setTimeout(r, 500));
      try {
        response = await callGemini(modelToUse);
      } catch {
        // Retry failed
      }
    }

    if (!response || !response.ok) {
      const errorData = response
        ? (((await response.json().catch(() => ({}))) as {
            error?: { message?: string; status?: string; code?: number };
          }))
        : null;

      const rawMsg = errorData?.error?.message || response?.statusText || '';

      if (rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('API key not valid')) {
        return NextResponse.json({
          reply:
            '⚠️ API Key chưa hợp lệ. Bạn hãy kiểm tra lại chuỗi khóa `GEMINI_API_KEY` đã được copy đủ trên Google AI Studio chưa nhé!',
        });
      }

      if (response?.status === 503 || rawMsg.includes('high demand') || rawMsg.includes('overloaded')) {
        return NextResponse.json({
          reply:
            '⏳ Máy chủ Google AI đang có lượng truy cập cao trong giây lát. Em hãy nhấn gửi lại câu hỏi sau 5 - 10 giây nhé!',
        });
      }

      return NextResponse.json({
        reply:
          '⏳ Máy chủ AI đang bận trong giây lát. Em bấm gửi lại câu hỏi để thử lại nhé!',
      });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const replyText =
      candidate?.content?.parts?.[0]?.text ||
      'Mình đã nhận được câu hỏi nhưng chưa thể tạo câu trả lời lúc này. Bạn thử hỏi lại nhé!';

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('AI Tutor API internal error:', error);
    return NextResponse.json({
      reply: '⏳ Đang có lượt truy cập đông, em vui lòng bấm gửi lại câu hỏi sau vài giây nhé!',
    });
  }
}
