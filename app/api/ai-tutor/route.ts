import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
Bạn là "Gia Sư AI Tiếng Anh" thông minh, tận tâm và thân thiện của nền tảng ENGLISH HUB - chuyên đồng hành cùng học sinh Việt Nam ôn thi Tốt Nghiệp THPT Quốc Gia môn Tiếng Anh (chuẩn cấu trúc mới 2027).

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

    // Helper to call Gemini API
    const callGemini = async (model: string) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

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

    // Use Google recommended model
    let response: Response | null = null;
    try {
      response = await callGemini('gemini-3.8-flash');
    } catch {
      // Abort or network error
    }

    // If 503 or failed, do one quick retry after 500ms
    if (!response || response.status === 503) {
      await new Promise((r) => setTimeout(r, 600));
      try {
        response = await callGemini('gemini-3.8-flash');
      } catch {
        // Abort or network error
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
            '⏳ Máy chủ Google AI đang có lượng học sinh truy cập cao trong giây lát. Em hãy bấm gửi lại sau 5 - 10 giây nhé!',
        });
      }

      return NextResponse.json({
        reply:
          '⏳ Máy chủ AI đang phản hồi chậm do lưu lượng truy cập cao. Em bấm gửi lại câu hỏi sau vài giây nhé!',
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
