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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Danh sách tin nhắn không hợp lệ.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          reply:
            '⚠️ Chưa tìm thấy GEMINI_API_KEY trên Vercel. Bạn hãy vào Vercel > Settings > Environment Variables, thêm biến `GEMINI_API_KEY` rồi Redeploy lại nhé!',
        },
        { status: 200 }
      );
    }

    // Format messages for Google Gemini generateContent API
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Call Google Gemini API (gemini-1.5-flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1200,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);

      // Friendly fallback if rate limited or invalid key
      return NextResponse.json(
        {
          reply:
            'Xin lỗi bạn, kết nối tới máy chủ Google Gemini đang bận hoặc API Key chưa được kích hoạt. Hãy thử lại sau vài giây hoặc kiểm tra biến GEMINI_API_KEY trên Vercel nhé!',
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const replyText =
      candidate?.content?.parts?.[0]?.text ||
      'Mình đã nhận được câu hỏi nhưng chưa thể tạo câu trả lời lúc này. Bạn thử hỏi lại nhé!';

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('AI Tutor API internal error:', error);
    return NextResponse.json(
      {
        reply:
          'Đã xảy ra lỗi kết nối. Bạn vui lòng thử lại câu hỏi sau một lát nhé!',
      },
      { status: 500 }
    );
  }
}
