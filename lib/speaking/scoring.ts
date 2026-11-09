// Advanced Evaluation & Scoring Engine for AI Speaking & Pronunciation Practice
// Rigorous 10-point scale (Thang điểm 10) with granular minor mistake detection

export interface WordAnalysis {
  expectedWord: string;
  spokenWord: string;
  status: 'perfect' | 'minor_mistake' | 'incorrect' | 'missing' | 'extra';
  similarity: number; // 0 to 1
  errorDetail?: string;
  phoneticNote?: string;
}

export interface PronunciationResult {
  score: number; // 0.0 to 10.0
  accuracyPercent: number; // 0 to 100
  phoneticScore: number; // 0.0 to 10.0
  fluencyScore: number; // 0.0 to 10.0
  grade: 'excellent' | 'good' | 'average' | 'needs_work';
  gradeLabel: string;
  gradeColor: string;
  gradeBg: string;
  transcript: string;
  expectedText: string;
  confidence: number;
  wordAnalysis: WordAnalysis[];
  minorMistakes: string[]; // Specific minor errors identified
  majorMistakes: string[]; // Specific major pronunciation deviations
  strengths: string[];
  improvements: string[]; // Detailed, actionable improvement checklist
  phoneticTips: string[];
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

// Detect ending sound dropping or alterations (s/es/ce/ed/t/d)
function detectEndingSoundMistake(expected: string, spoken: string): string | null {
  const exp = expected.toLowerCase();
  const spk = spoken.toLowerCase();

  // Case 1: Dropped plural or sibilant ending (-s, -es, -ce, -se)
  if (
    (exp.endsWith('s') || exp.endsWith('es') || exp.endsWith('ce') || exp.endsWith('se')) &&
    !spk.endsWith('s') &&
    !spk.endsWith('z') &&
    !spk.endsWith('ce') &&
    !spk.endsWith('se')
  ) {
    return `Nuốt âm đuôi gió /-s/ hoặc /-z/: Bạn đọc "${spk}" thay vì kết thúc bằng âm gió của "${exp}".`;
  }

  // Case 2: Dropped -ed ending (/t/, /d/, /ɪd/)
  if (exp.endsWith('ed') && !spk.endsWith('ed') && !spk.endsWith('t') && !spk.endsWith('d')) {
    return `Thiếu âm đuôi quá khứ "-ed": Từ gốc là "${exp}" nhưng bạn phát âm thành thể nguyên mẫu "${spk}".`;
  }

  // Case 3: Dropped final stop (/t/, /d/, /k/, /p/)
  const stops = ['t', 'd', 'k', 'p'];
  for (const stop of stops) {
    if (exp.endsWith(stop) && !spk.endsWith(stop) && exp.length > 2) {
      return `Bỏ quên âm chặn cuối /${stop}/: Hãy bật dứt khoát âm cuối của "${exp}".`;
    }
  }

  return null;
}

// Pitfalls specifically tailored to Vietnamese learners
const VIETNAMESE_PHONETIC_RULES: {
  pattern: RegExp;
  soundName: string;
  explanation: string;
}[] = [
  {
    pattern: /(resilience|perseverance|consequences|languages|makes|leads|circumstances)/i,
    soundName: 'Âm xì hơi /s/ hoặc /z/ ở âm cuối',
    explanation: 'Rất nhiều học sinh Việt Nam nuốt âm gió cuối cùng. Hãy đảm bảo khép nhẹ răng và đẩy hơi khi kết thúc.',
  },
  {
    pattern: /(arrived|accomplished|finished|decided|looked)/i,
    soundName: 'Phát âm đuôi -ed (/t/, /d/, /ɪd/)',
    explanation: 'Đuôi -ed bắt buộc phải bật rõ. Nếu sau âm vô thanh như "sh" phải bật /t/ (accomplished), sau nguyên âm bật /d/ (arrived).',
  },
  {
    pattern: /(catastrophe|characteristic|biodiversity|environmental)/i,
    soundName: 'Trọng âm từ nhiều âm tiết',
    explanation: 'Chú ý cao độ: ca-TAS-tro-phe (nhấn âm 2), cha-rac-te-RIS-tic (nhấn âm 4). Đừng đọc ngang bè bè các âm tiết.',
  },
  {
    pattern: /(breathes|clothes|threats|thought|than|the)/i,
    soundName: 'Âm kẹp lưỡi /θ/ và /ð/',
    explanation: 'Đặt đầu lưỡi nhẹ giữa hai hàm răng khi phát âm. Tránh đọc thành âm /t/ hoặc /d/ của tiếng Việt.',
  },
];

export function evaluatePronunciation(
  expectedText: string,
  userTranscript: string,
  speechConfidence: number = 0.95
): PronunciationResult {
  const cleanExpected = cleanSpeechText(expectedText);
  const cleanSpoken = cleanSpeechText(userTranscript);

  // If no speech detected at all
  if (!cleanSpoken) {
    return {
      score: 0.0,
      accuracyPercent: 0,
      phoneticScore: 0.0,
      fluencyScore: 0.0,
      grade: 'needs_work',
      gradeLabel: 'Chưa phát hiện giọng nói',
      gradeColor: 'text-rose-600',
      gradeBg: 'bg-rose-50 border-rose-200',
      transcript: '',
      expectedText,
      confidence: 0,
      wordAnalysis: [],
      minorMistakes: ['Microphone chưa thu được tín hiệu âm thanh nào.'],
      majorMistakes: ['Không có dữ liệu âm thanh để chấm điểm.'],
      strengths: [],
      improvements: [
        'Hệ thống chưa nhận được giọng nói. Bạn hãy kiểm tra lại mic, đưa micro lại gần khoảng 15cm và nói to, rõ ràng hơn nhé!',
      ],
      phoneticTips: ['Đảm bảo microphone không bị tắt tiếng và nói to dứt khoát.'],
    };
  }

  const expectedWords = cleanExpected.split(' ').filter(Boolean);
  const spokenWords = cleanSpoken.split(' ').filter(Boolean);

  const wordAnalysis: WordAnalysis[] = [];
  const minorMistakes: string[] = [];
  const majorMistakes: string[] = [];
  let totalWordSimilarity = 0;
  let perfectWordCount = 0;

  // Track matched spoken indices so we know if there are extra words
  const matchedSpokenIndices = new Set<number>();

  expectedWords.forEach((expectedWord, idx) => {
    // Look for exact or closest word in spoken words nearby
    let bestSimilarity = 0;
    let bestMatchIdx = -1;

    for (let i = 0; i < spokenWords.length; i++) {
      if (matchedSpokenIndices.has(i)) continue;
      const sim = calculateSimilarity(expectedWord, spokenWords[i]);
      if (sim > bestSimilarity) {
        bestSimilarity = sim;
        bestMatchIdx = i;
      }
    }

    const spokenWord = bestMatchIdx !== -1 ? spokenWords[bestMatchIdx] : '';
    if (bestMatchIdx !== -1) {
      matchedSpokenIndices.add(bestMatchIdx);
    }

    totalWordSimilarity += bestSimilarity;

    // Check specific minor error details
    let status: WordAnalysis['status'] = 'incorrect';
    let errorDetail: string | undefined = undefined;

    if (bestSimilarity >= 0.99 && expectedWord === spokenWord) {
      status = 'perfect';
      perfectWordCount++;
    } else if (bestSimilarity >= 0.75) {
      status = 'minor_mistake';
      // Detect ending sound mistake or substitution
      const endingError = detectEndingSoundMistake(expectedWord, spokenWord);
      if (endingError) {
        errorDetail = endingError;
        minorMistakes.push(endingError);
      } else {
        errorDetail = `Lệch nhẹ âm tiết: Phát âm thành "${spokenWord}" (chưa chuẩn xác 100% so với "${expectedWord}").`;
        minorMistakes.push(
          `Từ "${expectedWord}": Bạn phát âm thành "${spokenWord}". Cần chú ý độ căng của nguyên âm.`
        );
      }
    } else if (bestMatchIdx === -1 || bestSimilarity < 0.35) {
      status = 'missing';
      errorDetail = `Bị bỏ sót hoàn toàn: Bạn không đọc từ "${expectedWord}".`;
      majorMistakes.push(`Đọc thiếu từ "${expectedWord}" trong câu.`);
    } else {
      status = 'incorrect';
      errorDetail = `Phát âm sai hẳn: Bạn đọc "${spokenWord}" thay vì "${expectedWord}".`;
      majorMistakes.push(`Phát âm sai từ "${expectedWord}" thành "${spokenWord}".`);
    }

    wordAnalysis.push({
      expectedWord,
      spokenWord: spokenWord || '(bị bỏ sót)',
      status,
      similarity: bestSimilarity,
      errorDetail,
    });
  });

  // Check for extra words spoken
  spokenWords.forEach((w, idx) => {
    if (!matchedSpokenIndices.has(idx)) {
      minorMistakes.push(`Thừa từ hoặc âm chêm: Hệ thống nghe thấy từ "${w}" không có trong câu mẫu.`);
    }
  });

  // Length difference penalty (e.g. said 1 word when prompt had 8 words)
  const lengthRatio =
    Math.min(expectedWords.length, spokenWords.length) /
    Math.max(expectedWords.length, spokenWords.length);

  // Confidence check: If browser speech confidence is low (< 0.88), recognizer had to guess
  const rawConfidence = typeof speechConfidence === 'number' ? speechConfidence : 0.85;

  // Base accuracy (0 to 100)
  const avgSimilarity =
    expectedWords.length > 0 ? totalWordSimilarity / expectedWords.length : 0;
  const accuracyPercent = Math.round(avgSimilarity * lengthRatio * 100);

  // ── RIGOROUS SCORING SYSTEM (THANG ĐIỂM 10) ──
  // Start from maximum 10.0, apply deductions for every mistake
  let calculatedScore = 10.0;

  // Deduct for similarity shortfall
  calculatedScore -= (1 - avgSimilarity) * 6.5;

  // Deduct for length mismatch (missing words or extra mumbling)
  if (lengthRatio < 1.0) {
    calculatedScore -= (1 - lengthRatio) * 3.0;
  }

  // Deduct for minor mistakes (-0.5 to -0.8 each)
  calculatedScore -= minorMistakes.length * 0.6;

  // Deduct for major mistakes (-1.2 to -2.0 each)
  calculatedScore -= majorMistakes.length * 1.5;

  // Confidence penalty: if speech confidence is low, student was unclear or slurring
  if (rawConfidence < 0.88 && rawConfidence > 0) {
    const confPenalty = (0.90 - rawConfidence) * 3.5;
    calculatedScore -= Math.max(0.3, Math.min(1.8, confPenalty));
    minorMistakes.push(
      `Độ rõ nét của giọng đọc đạt ${Math.round(rawConfidence * 100)}%: Âm thanh còn hơi nhỏ hoặc chưa dứt khoát khiến máy học phải phỏng đoán từ.`
    );
  }

  // STRICT RULE: 10.0 is ONLY possible when:
  // 1. Every single word is a perfect match
  // 2. No minor mistakes
  // 3. No major mistakes
  // 4. Confidence >= 0.90
  const isPristine =
    cleanExpected === cleanSpoken &&
    minorMistakes.length === 0 &&
    majorMistakes.length === 0 &&
    rawConfidence >= 0.88;

  if (isPristine) {
    calculatedScore = 10.0;
  } else if (cleanExpected === cleanSpoken && (minorMistakes.length > 0 || rawConfidence < 0.88)) {
    // Spoken words match superficially, but confidence was low or minor phonetic deviation exists
    calculatedScore = Math.min(8.8, Math.max(7.2, calculatedScore));
  } else {
    // Cap score if any mistakes exist
    calculatedScore = Math.min(9.2, calculatedScore);
  }

  // Clamp score between 1.0 and 10.0 (or 0.0 if totally wrong)
  if (avgSimilarity < 0.3) {
    calculatedScore = Math.min(2.0, calculatedScore);
  }
  calculatedScore = Math.max(1.0, Math.min(10.0, calculatedScore));

  const score = Math.round(calculatedScore * 10) / 10;
  const phoneticScore = Math.round(Math.max(1.0, score * 0.95 + (avgSimilarity - 0.5)) * 10) / 10;
  const fluencyScore = Math.round(Math.max(1.0, score * (0.8 + 0.2 * lengthRatio)) * 10) / 10;

  // Grade categorization
  let grade: 'excellent' | 'good' | 'average' | 'needs_work';
  let gradeLabel: string;
  let gradeColor: string;
  let gradeBg: string;

  if (score >= 9.0) {
    grade = 'excellent';
    gradeLabel = 'Xuất sắc! Phát âm chuẩn bản xứ';
    gradeColor = 'text-emerald-600';
    gradeBg = 'bg-emerald-50 border-emerald-300';
  } else if (score >= 8.0) {
    grade = 'good';
    gradeLabel = 'Rất tốt! Đạt chuẩn 8+ (còn 1-2 lỗi nhỏ)';
    gradeColor = 'text-indigo-600';
    gradeBg = 'bg-indigo-50 border-indigo-300';
  } else if (score >= 6.5) {
    grade = 'average';
    gradeLabel = 'Khá! Cần sửa lỗi âm đuôi & độ dứt khoát';
    gradeColor = 'text-amber-600';
    gradeBg = 'bg-amber-50 border-amber-300';
  } else {
    grade = 'needs_work';
    gradeLabel = 'Cần cố gắng! Phát âm lệch nhiều so với mẫu';
    gradeColor = 'text-rose-600';
    gradeBg = 'bg-rose-50 border-rose-300';
  }

  // ── IDENTIFY STRENGTHS ──
  const strengths: string[] = [];
  if (perfectWordCount === expectedWords.length) {
    strengths.push(`Phát âm trọn vẹn chính xác toàn bộ ${expectedWords.length}/${expectedWords.length} từ trong câu.`);
  } else if (perfectWordCount > 0) {
    strengths.push(`Đã phát âm chuẩn xác ${perfectWordCount}/${expectedWords.length} từ khóa quan trọng.`);
  }

  if (rawConfidence >= 0.88) {
    strengths.push('Âm lượng và độ bắt mic rất tốt, giọng nói to và rõ ràng.');
  }

  if (lengthRatio >= 0.95) {
    strengths.push('Tốc độ đọc vừa phải, không bị ngắt quãng hoặc ngập ngừng giữa chừng.');
  }

  if (strengths.length === 0) {
    strengths.push('Bạn đã tự tin bấm micro và phát âm câu tiếng Anh.');
  }

  // ── IDENTIFY HIGHLY SPECIFIC IMPROVEMENTS (NHƯỢC ĐIỂM CẦN CẢI THIỆN) ──
  const improvements: string[] = [];

  // 1. Add specific major mistakes first
  if (majorMistakes.length > 0) {
    majorMistakes.forEach((m) => {
      improvements.push(`🔴 ${m}`);
    });
  }

  // 2. Add specific minor mistakes
  if (minorMistakes.length > 0) {
    minorMistakes.forEach((m) => {
      improvements.push(`🟡 ${m}`);
    });
  }

  // 3. Check specific Vietnamese phonetic pitfalls for target sentence
  const phoneticTips: string[] = [];
  VIETNAMESE_PHONETIC_RULES.forEach((rule) => {
    if (rule.pattern.test(expectedText) && !phoneticTips.includes(rule.explanation)) {
      phoneticTips.push(`📌 ${rule.soundName}: ${rule.explanation}`);
    }
  });

  if (phoneticTips.length === 0) {
    phoneticTips.push(
      '📌 Mẹo phát âm chuẩn: Mở rộng khẩu hình vòm họng và giữ hơi bụng đều đặn khi chuyển tiếp giữa các âm tiết.'
    );
  }

  if (improvements.length === 0 && score === 10.0) {
    improvements.push('🟢 Phát âm đạt điểm 10 tuyệt đối! Cả âm đuôi, ngữ điệu và độ dứt khoát đều hoàn hảo.');
  }

  return {
    score,
    accuracyPercent,
    phoneticScore: Math.min(10.0, phoneticScore),
    fluencyScore: Math.min(10.0, fluencyScore),
    grade,
    gradeLabel,
    gradeColor,
    gradeBg,
    transcript: userTranscript,
    expectedText,
    confidence: rawConfidence,
    wordAnalysis,
    minorMistakes,
    majorMistakes,
    strengths,
    improvements,
    phoneticTips: phoneticTips.slice(0, 3),
  };
}
