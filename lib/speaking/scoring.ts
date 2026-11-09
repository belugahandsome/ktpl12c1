// Evaluation and scoring engine for AI Speaking & Pronunciation Practice
// Normalized to Vietnamese education 10-point scale (Thang điểm 10)

export interface WordAnalysis {
  word: string;
  expectedWord: string;
  isMatch: boolean;
  similarity: number; // 0 to 1
  note?: string;
}

export interface PronunciationResult {
  score: number; // 0.0 to 10.0
  grade: 'excellent' | 'good' | 'average' | 'needs_work';
  gradeLabel: string;
  gradeColor: string; // Tailwind class
  gradeBg: string;
  transcript: string;
  expectedText: string;
  accuracyPercent: number;
  wordAnalysis: WordAnalysis[];
  strengths: string[];
  improvements: string[];
  phoneticTips: string[];
  mouthPlacementGuide?: string;
}

// Clean and normalize text for pronunciation comparison
export function cleanSpeechText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance for string similarity calculation
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Calculate similarity ratio between 0 and 1
export function calculateSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(s1, s2);
  return Math.max(0, 1 - distance / maxLen);
}

// Common phonetic pitfalls for Vietnamese learners of English
const COMMON_VIETNAMESE_PITFALLS: {
  test: (word: string) => boolean;
  sound: string;
  tip: string;
}[] = [
  {
    test: (w) => /[s|z|x|ce|se|ze]$/i.test(w) || w.endsWith('s') || w.endsWith('es'),
    sound: 'Âm đuôi /-s/, /-z/, /-iz/',
    tip: 'Người Việt hay quên bật âm gió cuối từ (ending /s/). Hãy giữ luồng hơi nhẹ qua kẽ răng khi kết thúc từ.',
  },
  {
    test: (w) => w.endsWith('ed'),
    sound: 'Đuôi /-ed/ (/t/, /d/, /ɪd/)',
    tip: 'Lưu ý 3 quy tắc phát âm đuôi -ed: /ɪd/ sau t/d (wanted), /t/ sau phụ âm vô thanh (looked, laughed), và /d/ cho các trường hợp còn lại.',
  },
  {
    test: (w) => /th/i.test(w),
    sound: 'Âm /θ/ và /ð/ (th)',
    tip: 'Đừng phát âm âm "th" thành âm "t" hay "d" tiếng Việt. Hãy đặt đầu lưỡi nhẹ giữa hai hàm răng và đẩy luồng hơi ra.',
  },
  {
    test: (w) => /[t|d|k|p|b|g]$/i.test(w),
    sound: 'Âm chặn cuối từ (Final stops /t/, /d/, /k/, /p/)',
    tip: 'Hãy bật dứt khoát âm cuối (chặn hơi lại một nhịp ngắn) để người bản xứ không nhầm lẫn với các từ đồng âm.',
  },
  {
    test: (w) => /tion|sion|cial|tial/i.test(w),
    sound: 'Âm /ʃ/ (sh mạnh)',
    tip: 'Chu môi nhẹ tròn ra phía trước, đẩy hơi mạnh không rung dây thanh quản (ví dụ: education, pollution, commercial).',
  },
];

export function evaluatePronunciation(
  expectedText: string,
  userTranscript: string,
  speechConfidence: number = 0.95
): PronunciationResult {
  const cleanExpected = cleanSpeechText(expectedText);
  const cleanSpoken = cleanSpeechText(userTranscript);

  if (!cleanSpoken) {
    return {
      score: 0.0,
      grade: 'needs_work',
      gradeLabel: 'Chưa phát hiện giọng nói',
      gradeColor: 'text-rose-600',
      gradeBg: 'bg-rose-50 border-rose-200',
      transcript: '',
      expectedText,
      accuracyPercent: 0,
      wordAnalysis: [],
      strengths: [],
      improvements: [
        'Hệ thống chưa thu nhận được giọng nói. Bạn hãy kiểm tra quyền truy cập microphone trên trình duyệt và nói to, rõ ràng hơn nhé!',
      ],
      phoneticTips: ['Đảm bảo microphone không bị tắt tiếng (mute) và nói gần micro 15-20cm.'],
    };
  }

  const expectedWords = cleanExpected.split(' ').filter(Boolean);
  const spokenWords = cleanSpoken.split(' ').filter(Boolean);

  const wordAnalysis: WordAnalysis[] = [];
  let totalWordSimilarity = 0;

  expectedWords.forEach((expectedWord, idx) => {
    // Look for exact or closest word in spoken words nearby
    const spokenWord = spokenWords[idx] || '';
    let bestSimilarity = calculateSimilarity(expectedWord, spokenWord);
    let matchedWord = spokenWord;

    // Search window of +- 1 position in case of dropped/added words
    for (let offset = -1; offset <= 1; offset++) {
      const neighborIdx = idx + offset;
      if (neighborIdx >= 0 && neighborIdx < spokenWords.length) {
        const sim = calculateSimilarity(expectedWord, spokenWords[neighborIdx]);
        if (sim > bestSimilarity) {
          bestSimilarity = sim;
          matchedWord = spokenWords[neighborIdx];
        }
      }
    }

    const isMatch = bestSimilarity >= 0.82;
    totalWordSimilarity += bestSimilarity;

    wordAnalysis.push({
      word: matchedWord || '(bị bỏ sót)',
      expectedWord,
      isMatch,
      similarity: bestSimilarity,
      note: isMatch
        ? 'Phát âm chính xác'
        : bestSimilarity > 0.5
        ? 'Gần đúng, chú ý âm tiết'
        : 'Cần phát âm rõ hơn',
    });
  });

  // Calculate overall word-level accuracy (0 - 100)
  const averageSimilarity =
    expectedWords.length > 0 ? totalWordSimilarity / expectedWords.length : 0;
  
  // Calculate raw score on a 10-point scale
  // Factor in speech API recognition confidence (range 0.7 - 1.0)
  const confidenceWeight = Math.min(1.0, Math.max(0.7, speechConfidence));
  let rawScore = averageSimilarity * 9.5 * (0.8 + 0.2 * confidenceWeight);

  // Bonus for 100% exact match
  if (cleanExpected === cleanSpoken) {
    rawScore = 10.0;
  } else if (rawScore > 9.8) {
    rawScore = 9.8;
  }

  // Ensure minimum baseline if they spoke something recognizable
  if (spokenWords.length > 0 && rawScore < 2.5) {
    rawScore = Math.max(2.5, rawScore);
  }

  // Round to 1 decimal place (e.g. 8.5)
  const score = Math.round(rawScore * 10) / 10;
  const accuracyPercent = Math.round(averageSimilarity * 100);

  // Grade categorization
  let grade: 'excellent' | 'good' | 'average' | 'needs_work';
  let gradeLabel: string;
  let gradeColor: string;
  let gradeBg: string;

  if (score >= 9.0) {
    grade = 'excellent';
    gradeLabel = 'Xuất sắc! Chuẩn ngữ điệu bản xứ';
    gradeColor = 'text-emerald-600';
    gradeBg = 'bg-emerald-50 border-emerald-300';
  } else if (score >= 8.0) {
    grade = 'good';
    gradeLabel = 'Rất tốt! Phát âm rõ ràng, chuẩn âm';
    gradeColor = 'text-indigo-600';
    gradeBg = 'bg-indigo-50 border-indigo-300';
  } else if (score >= 6.5) {
    grade = 'average';
    gradeLabel = 'Khá! Cần chú ý thêm âm đuôi và nối âm';
    gradeColor = 'text-amber-600';
    gradeBg = 'bg-amber-50 border-amber-300';
  } else {
    grade = 'needs_work';
    gradeLabel = 'Cần cố gắng! Hãy nghe lại AI và repeat chậm';
    gradeColor = 'text-rose-600';
    gradeBg = 'bg-rose-50 border-rose-300';
  }

  // Strengths identification
  const strengths: string[] = [];
  if (score >= 8.0) {
    strengths.push('Nhận diện âm rõ ràng, micro bắt âm tốt.');
    strengths.push('Tốc độ nói và ngữ điệu tự nhiên, tự tin.');
  }
  const accurateCount = wordAnalysis.filter((w) => w.isMatch).length;
  if (accurateCount === expectedWords.length) {
    strengths.push(`Nói trọn vẹn ${expectedWords.length}/${expectedWords.length} từ mà không bị rơi rụng âm.`);
  } else if (accurateCount > 0) {
    strengths.push(`Đã phát âm chuẩn xác ${accurateCount}/${expectedWords.length} từ trong câu.`);
  }

  // Improvements and diagnostics
  const improvements: string[] = [];
  const phoneticTips: string[] = [];

  const missedWords = wordAnalysis.filter((w) => !w.isMatch);
  if (missedWords.length > 0) {
    const listMissed = missedWords.map((w) => `"${w.expectedWord}"`).join(', ');
    improvements.push(`Các từ cần điều chỉnh cách phát âm: ${listMissed}.`);
  }

  if (spokenWords.length < expectedWords.length) {
    improvements.push(
      `Bạn đang nói thiếu ${expectedWords.length - spokenWords.length} từ so với câu mẫu.`
    );
  }

  // Check phonetic pitfalls for words in this sample
  expectedWords.forEach((word) => {
    COMMON_VIETNAMESE_PITFALLS.forEach((pitfall) => {
      if (pitfall.test(word) && !phoneticTips.includes(pitfall.tip)) {
        phoneticTips.push(`${pitfall.sound} trong từ "${word}": ${pitfall.tip}`);
      }
    });
  });

  // Default fallback guidance if no specific pitfalls triggered
  if (phoneticTips.length === 0) {
    phoneticTips.push(
      'Mẹo phát âm: Hãy mở rộng khẩu hình miệng và phát âm rõ từng nguyên âm, giữ hơi đều đặn từ bụng.'
    );
  }

  if (improvements.length === 0 && score >= 9.0) {
    improvements.push('Phát âm của bạn đã đạt chuẩn 9+ THPT & IELTS Speaking! Tiếp tục duy trì phong độ.');
  }

  return {
    score,
    grade,
    gradeLabel,
    gradeColor,
    gradeBg,
    transcript: userTranscript,
    expectedText,
    accuracyPercent,
    wordAnalysis,
    strengths,
    improvements,
    phoneticTips: phoneticTips.slice(0, 3), // Top 3 practical tips
  };
}
