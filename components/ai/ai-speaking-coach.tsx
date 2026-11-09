'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  TrendingUp,
  History,
  BookmarkCheck,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Bot,
  Zap,
  Settings2,
  ShieldAlert,
  Radio,
  FileEdit,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  SPEAKING_PRESETS,
  SpeakingItem,
} from '@/lib/speaking/speaking-presets';
import {
  evaluatePronunciation,
  PronunciationResult,
  cleanSpeechText,
} from '@/lib/speaking/scoring';

interface PracticeHistoryItem {
  id: string;
  targetText: string;
  transcript: string;
  score: number;
  timestamp: string;
  gradeLabel: string;
}

export function AiSpeakingCoach({
  initialWord,
  initialIpa,
}: {
  initialWord?: string;
  initialIpa?: string;
}) {
  // Preset or custom target selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    initialWord ? 'custom' : SPEAKING_PRESETS[0].id
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [customText, setCustomText] = useState<string>(initialWord || '');
  const [customIpa, setCustomIpa] = useState<string>(initialIpa || '');

  // Audio Playback (AI Speech Synthesis)
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);

  // Voice Recording (Speech Recognition & MediaRecorder)
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'not-allowed' | 'network' | 'no-speech' | 'not-supported' | 'other' | null>(null);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState<boolean>(true);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [showTroubleshooter, setShowTroubleshooter] = useState<boolean>(false);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualSpokenText, setManualSpokenText] = useState<string>('');

  // Diagnostic state
  const [diagRunning, setDiagRunning] = useState<boolean>(false);
  const [diagResult, setDiagResult] = useState<{
    micAvailable: boolean;
    speechApiAvailable: boolean;
    volumeDetected: boolean;
    message: string;
  } | null>(null);

  // Scoring & Feedback
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);

  // Practice History
  const [history, setHistory] = useState<PracticeHistoryItem[]>([]);

  // Refs for audio handling
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const latestTranscriptRef = useRef<string>('');
  const evaluatedRef = useRef<boolean>(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('eh_speaking_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {}

    // Check SpeechRecognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setHasSpeechRecognition(false);
      }
    }

    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  // Determine current target item
  const currentItem: SpeakingItem | null =
    selectedPresetId === 'custom'
      ? {
          id: 'custom',
          category: 'vocab_stress',
          categoryLabel: 'Từ / Câu tự do',
          targetText: customText.trim() || 'Resilience',
          ipa: customIpa.trim() || '/rɪˈzɪliəns/',
          stressGuide: 'Nhấn rõ trọng âm và phụ âm cuối',
          meaningVi: 'Nội dung bạn tự nhập để kiểm tra phát âm',
          difficulty: 'medium',
          tip: 'Hãy phát âm rõ ràng, to và dứt khoát các âm cuối /s/, /t/, /d/.',
        }
      : SPEAKING_PRESETS.find((p) => p.id === selectedPresetId) || SPEAKING_PRESETS[0];

  const handleSelectPreset = (id: string) => {
    stopAiSpeaking();
    stopListening();
    setSelectedPresetId(id);
    setResult(null);
    setFinalTranscript('');
    setInterimTranscript('');
    latestTranscriptRef.current = '';
    setGeminiFeedback(null);
    setUserAudioUrl(null);
    setMicPermissionError(null);
    setErrorType(null);
    setShowManualInput(false);
  };

  // ── 1. AI SPEECH SYNTHESIS (AI ĐỌC MẪU) ──
  const speakText = (text: string, rate: number = 1.0) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng phát âm.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAiSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  };

  // ── 2. MICROPHONE & SPEECH RECOGNITION (NGƯỜI HỌC REPEAT) ──
  const startListening = async () => {
    if (typeof window === 'undefined') return;

    stopAiSpeaking();
    cleanupAudio();

    setMicPermissionError(null);
    setErrorType(null);
    setResult(null);
    setFinalTranscript('');
    setInterimTranscript('');
    latestTranscriptRef.current = '';
    evaluatedRef.current = false;
    setGeminiFeedback(null);
    setUserAudioUrl(null);

    // Step A: Explicitly request microphone stream via getUserMedia
    // This forces browser permission prompt if not yet granted
    let stream: MediaStream | null = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        mediaStreamRef.current = stream;

        // Setup real-time visualizer
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            const source = ctx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateVolume = () => {
              if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setAudioVolume(Math.min(100, Math.round((avg / 128) * 100)));
              animationFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();
          }
        } catch {}

        // Setup MediaRecorder to record user's playback audio
        try {
          audioChunksRef.current = [];
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          recorder.onstop = () => {
            if (audioChunksRef.current.length > 0) {
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              setUserAudioUrl(URL.createObjectURL(audioBlob));
            }
          };
          recorder.start();
        } catch {}
      }
    } catch (err: any) {
      setIsListening(false);
      const errName = err?.name || '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setErrorType('not-allowed');
        setMicPermissionError(
          'Quyền truy cập Microphone đã bị chặn hoặc từ chối trên trình duyệt. Vui lòng bấm vào biểu tượng 🔒 hoặc ⚙️ bên trái thanh địa chỉ web để CHO PHÉP (Allow) Micro.'
        );
        setShowTroubleshooter(true);
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setErrorType('other');
        setMicPermissionError(
          'Không tìm thấy thiết bị Microphone trên máy tính hoặc điện thoại của bạn. Vui lòng cắm tai nghe có mic hoặc bật mic.'
        );
        setShowTroubleshooter(true);
      } else {
        setErrorType('other');
        setMicPermissionError(
          `Không thể kích hoạt micro (${err?.message || errName}). Bạn có thể thử cấp quyền lại hoặc dùng chế độ nhập từ bên dưới.`
        );
        setShowTroubleshooter(true);
      }
      return;
    }

    // Step B: Initialize SpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSpeechRecognition(false);
      setErrorType('not-supported');
      setIsListening(true);
      setMicPermissionError(
        'Trình duyệt này (như Firefox hoặc trình duyệt nhúng) chưa hỗ trợ Web Speech API nhận diện giọng nói tự động. Bạn vẫn có thể ghi âm nghe lại hoặc chọn nhanh từ vừa phát âm để AI chấm điểm 10!'
      );
      setShowManualInput(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        setMicPermissionError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const bestTranscript = final || interim;
        latestTranscriptRef.current = bestTranscript;

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setFinalTranscript(final);
          evaluatedRef.current = true;
          const confidence = event.results[0]?.[0]?.confidence || 0.92;
          processEvaluation(currentItem.targetText, final, confidence);
        }
      };

      recognition.onerror = (event: any) => {
        const error = event.error;
        console.warn('SpeechRecognition error:', error);

        if (error === 'not-allowed') {
          setErrorType('not-allowed');
          setMicPermissionError(
            'Quyền truy cập Microphone bị từ chối. Hãy bấm vào biểu tượng Ổ khóa 🔒 trên thanh địa chỉ của trình duyệt, chọn "Cho phép (Allow)" Micro rồi tải lại trang.'
          );
          setShowTroubleshooter(true);
        } else if (error === 'network') {
          setErrorType('network');
          setMicPermissionError(
            'Lỗi kết nối tới máy chủ nhận diện giọng nói Google (Network error). Vui lòng kiểm tra mạng, tắt VPN hoặc tắt tiện ích chặn quảng cáo (AdBlock), hoặc dùng chức năng nhập từ để AI chấm điểm.'
          );
          setShowManualInput(true);
        } else if (error === 'no-speech') {
          setErrorType('no-speech');
          setMicPermissionError(
            'Micro chưa nhận được giọng nói. Bạn hãy nói to hơn, đưa micro lại gần khoảng 15-20cm và bấm nói lại nhé!'
          );
        } else if (error === 'audio-capture') {
          setErrorType('other');
          setMicPermissionError('Không thu được tín hiệu âm thanh từ Microphone của thiết bị.');
          setShowTroubleshooter(true);
        } else {
          setMicPermissionError(`Lỗi nhận diện âm thanh (${error}). Vui lòng bấm thử lại.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setAudioVolume(0);

        // Stop media recorder to finalize user audio playback
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          try {
            mediaRecorderRef.current.stop();
          } catch {}
        }

        // If recognition ended and final was not evaluated, but we have captured transcript
        if (!evaluatedRef.current && latestTranscriptRef.current.trim().length > 0) {
          evaluatedRef.current = true;
          setFinalTranscript(latestTranscriptRef.current);
          processEvaluation(currentItem.targetText, latestTranscriptRef.current, 0.88);
        } else if (!evaluatedRef.current && !latestTranscriptRef.current) {
          // If stopped without any words captured, suggest typing or checking mic
          setShowManualInput(true);
        }
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorType('other');
      setMicPermissionError(
        'Không thể khởi động Speech Recognition: ' + (err?.message || 'Vui lòng kiểm tra quyền micro.')
      );
      setShowTroubleshooter(true);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setAudioVolume(0);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    // Process evaluation if we captured words
    if (!evaluatedRef.current && latestTranscriptRef.current.trim().length > 0) {
      evaluatedRef.current = true;
      setFinalTranscript(latestTranscriptRef.current);
      processEvaluation(currentItem.targetText, latestTranscriptRef.current, 0.88);
    }
  };

  // ── 3. CHẤM ĐIỂM THANG 10 & LƯU LỊCH SỬ ──
  const processEvaluation = (target: string, spoken: string, confidence: number = 0.92) => {
    setIsEvaluating(true);
    setMicPermissionError(null);

    setTimeout(() => {
      const evalResult = evaluatePronunciation(target, spoken, confidence);
      setResult(evalResult);
      setIsEvaluating(false);

      if (evalResult.score >= 8.5) {
        try {
          confetti({
            particleCount: 70,
            spread: 75,
            origin: { y: 0.6 },
          });
        } catch {}
      }

      const historyEntry: PracticeHistoryItem = {
        id: Date.now().toString(),
        targetText: target,
        transcript: spoken,
        score: evalResult.score,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        gradeLabel: evalResult.gradeLabel,
      };

      const updatedHistory = [historyEntry, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem('eh_speaking_history', JSON.stringify(updatedHistory));
      } catch {}
    }, 450);
  };

  // ── 4. CHẤM ĐIỂM THỦ CÔNG KHI MICRO KHÔNG KHẢ DỤNG ──
  const handleManualEvaluate = (textToEval: string) => {
    const text = textToEval.trim();
    if (!text) return;
    setFinalTranscript(text);
    processEvaluation(currentItem.targetText, text, 0.95);
    setShowManualInput(false);
  };

  // ── 5. RUN DIAGNOSTIC TOOL ──
  const runMicrophoneDiagnostic = async () => {
    setDiagRunning(true);
    setDiagResult(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const hasSpeech = !!SpeechRecognition;

    let hasMicHardware = false;
    let volumeDetected = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      hasMicHardware = true;

      // Test audio level for 1.5 seconds
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      const src = ctx.createMediaStreamSource(stream);
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      let count = 0;
      const interval = setInterval(() => {
        analyser.getByteFrequencyData(data);
        const sum = data.reduce((a, b) => a + b, 0);
        if (sum > 0) volumeDetected = true;
        count++;
        if (count > 10) {
          clearInterval(interval);
          stream.getTracks().forEach((t) => t.stop());
          try {
            ctx.close();
          } catch {}

          setDiagResult({
            micAvailable: hasMicHardware,
            speechApiAvailable: hasSpeech,
            volumeDetected: true,
            message:
              hasMicHardware && hasSpeech
                ? '✅ Microphone và dịch vụ nhận diện giọng nói đang hoạt động hoàn hảo! Bạn có thể bắt đầu luyện nói ngay.'
                : hasMicHardware && !hasSpeech
                ? '⚠️ Microphone hoạt động tốt, nhưng trình duyệt chưa hỗ trợ Web Speech API. Bạn nên mở bằng Google Chrome hoặc Microsoft Edge.'
                : '❌ Cần kiểm tra lại quyền truy cập Microphone.',
          });
          setDiagRunning(false);
        }
      }, 100);
    } catch (err: any) {
      setDiagRunning(false);
      setDiagResult({
        micAvailable: false,
        speechApiAvailable: hasSpeech,
        volumeDetected: false,
        message:
          '❌ Quyền Microphone đang bị chặn: ' +
          (err?.name === 'NotAllowedError'
            ? 'Trình duyệt chưa được cấp quyền dùng Micro. Hãy bấm biểu tượng 🔒 trên thanh địa chỉ web để bật.'
            : err?.message || 'Lỗi không xác định.'),
      });
      setShowTroubleshooter(true);
    }
  };

  // ── 6. NHẬN XÉT CHUYÊN SÂU TỪ GEMINI AI ──
  const handleDeepGeminiAnalysis = async () => {
    if (!result) return;
    setIsLoadingGemini(true);
    setGeminiFeedback(null);

    try {
      const prompt = `Bạn là Giám khảo chuyên gia chấm thi Speaking THPT Quốc Gia & IELTS.
Học sinh vừa luyện phát âm:
- Từ/câu mẫu chuẩn: "${result.expectedText}"
- Học sinh vừa phát âm: "${result.transcript}"
- Điểm thuật toán chấm hiện tại: ${result.score}/10.0

Hãy đưa ra nhận xét ngắn gọn và thiết thực (3-4 gạch đầu dòng xúc tích, thân thiện):
1. Đánh giá độ chính xác của phụ âm và nguyên âm
2. Chỉ ra lỗi âm đuôi (như /s/, /z/, /ed/, /t/, /d/) hoặc lỗi trọng âm người Việt hay mắc phải
3. Hướng dẫn khẩu hình miệng và cách phát âm để đạt điểm 10 tuyệt đối.`;

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          context: 'Phòng Luyện Phát Âm Speaking AI Thang Điểm 10',
          history: [],
        }),
      });

      if (!res.ok) {
        throw new Error('Máy chủ AI đang bận');
      }

      const data = await res.json();
      setGeminiFeedback(data.reply || 'Không có phản hồi từ AI.');
    } catch (err: any) {
      setGeminiFeedback(
        'Không thể kết nối đến Gemini AI lúc này. Bạn vẫn có thể xem nhận xét thuật toán chi tiết ở trên nhé!'
      );
    } finally {
      setIsLoadingGemini(false);
    }
  };

  // Filter presets
  const filteredPresets =
    categoryFilter === 'all'
      ? SPEAKING_PRESETS
      : SPEAKING_PRESETS.filter((p) => p.category === categoryFilter);

  // Statistics
  const totalPractices = history.length;
  const avgScore =
    totalPractices > 0
      ? (history.reduce((acc, curr) => acc + curr.score, 0) / totalPractices).toFixed(1)
      : '0.0';
  const highestScore =
    totalPractices > 0 ? Math.max(...history.map((h) => h.score)).toFixed(1) : '0.0';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── TOP STATS OVERVIEW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{avgScore}/10</div>
            <div className="text-xs sm:text-sm font-bold text-slate-500">Điểm trung bình của bạn</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{highestScore}/10</div>
            <div className="text-xs sm:text-sm font-bold text-slate-500">Điểm cao nhất đạt được</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-900">{totalPractices}</div>
            <div className="text-xs sm:text-sm font-bold text-slate-500">Lượt phát âm đã luyện</div>
          </div>
        </div>
      </div>

      {/* ── MAIN STUDIO WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: TOPIC SELECTION & PRESETS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-200 shadow-md">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Kho Mẫu Luyện Phát Âm
                </CardTitle>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                  {SPEAKING_PRESETS.length} bài mẫu
                </span>
              </div>
              <CardDescription className="text-xs font-medium text-slate-500">
                Chọn chủ đề trọng tâm hoặc nhập từ vựng bạn muốn AI kiểm tra
              </CardDescription>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setCategoryFilter('vocab_stress')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'vocab_stress'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Trọng âm
                </button>
                <button
                  onClick={() => setCategoryFilter('ending_sounds')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'ending_sounds'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Âm đuôi /s/, /ed/
                </button>
                <button
                  onClick={() => setCategoryFilter('collocation')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'collocation'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Collocations
                </button>
                <button
                  onClick={() => setCategoryFilter('sentence_structure')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'sentence_structure'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Cấu trúc 8+
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-3 space-y-2 max-h-[460px] overflow-y-auto">
              {/* Custom Input Tab Trigger */}
              <div
                onClick={() => handleSelectPreset('custom')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedPresetId === 'custom'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-dashed border-slate-300 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    ✏️
                  </div>
                  <div>
                    <div className="text-sm font-black">Tự nhập từ hoặc câu bất kỳ</div>
                    <div className="text-xs text-slate-500 font-medium">Luyện bất kỳ từ vựng nào bạn muốn</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Presets List */}
              {filteredPresets.map((item) => {
                const isSelected = selectedPresetId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectPreset(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900">{item.targetText}</span>
                          <span className="text-[11px] font-mono text-indigo-600 bg-indigo-100/70 px-1.5 py-0.5 rounded">
                            {item.ipa}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 font-medium">{item.meaningVi}</p>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          item.difficulty === 'easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.difficulty === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* MICROPHONE DIAGNOSTICS & HELP WIDGET */}
          <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/30 shadow-xs">
            <CardHeader className="py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-indigo-600" />
                  Công Cụ Kiểm Tra Micro
                </CardTitle>
                <button
                  onClick={() => setShowTroubleshooter(!showTroubleshooter)}
                  className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  {showTroubleshooter ? 'Đóng hướng dẫn' : 'Cách sửa lỗi mic'}
                </button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Button
                  onClick={runMicrophoneDiagnostic}
                  disabled={diagRunning}
                  variant="outline"
                  size="sm"
                  className="text-xs font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50 w-full justify-center gap-1.5 cursor-pointer"
                >
                  <Radio className={`w-3.5 h-3.5 ${diagRunning ? 'animate-pulse text-rose-500' : ''}`} />
                  <span>{diagRunning ? 'Đang test micro...' : 'Kiểm Tra Tín Hiệu Micro'}</span>
                </Button>
              </div>

              {diagResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium border leading-relaxed ${
                    diagResult.micAvailable
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {diagResult.message}
                </div>
              )}

              {/* STEP BY STEP TROUBLESHOOTING GUIDE */}
              {showTroubleshooter && (
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 text-xs text-slate-700 animate-fade-in">
                  <div className="font-black text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>3 Bước Khắc Phục Lỗi Không Bật Được Micro:</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed font-medium">
                    <li>
                      <strong>Cấp quyền trên trình duyệt:</strong> Nhìn lên thanh địa chỉ web, bấm vào biểu tượng <strong>Ổ khóa 🔒</strong> hoặc <strong>Cài đặt trang web</strong> cạnh link <code>ktpl12c1.vercel.app</code> ➔ Đổi <strong>Microphone</strong> thành <strong>Cho phép (Allow)</strong> ➔ Bấm <strong>Tải lại trang (F5)</strong>.
                    </li>
                    <li>
                      <strong>Cài đặt quyền Windows 10/11:</strong> Mở <em>Start Menu ➔ Settings (Cài đặt) ➔ Privacy & security (Quyền riêng tư) ➔ Microphone ➔ Bật "Microphone access"</em> và bật <em>"Let desktop apps access your microphone"</em>.
                    </li>
                    <li>
                      <strong>Trình duyệt tối ưu:</strong> Hãy mở trang web bằng <strong>Google Chrome</strong> hoặc <strong>Microsoft Edge</strong> để có chất lượng nhận diện giọng nói chuẩn xác nhất.
                    </li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RECENT ATTEMPTS WIDGET */}
          {history.length > 0 && (
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Lịch sử 5 lần gần nhất
                </CardTitle>
                <button
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('eh_speaking_history');
                  }}
                  className="text-[11px] text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                >
                  Xóa
                </button>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-0 divide-y divide-slate-100">
                {history.slice(0, 5).map((h) => (
                  <div key={h.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800">{h.targetText}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{h.timestamp}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-black text-sm ${
                          h.score >= 8.5
                            ? 'text-emerald-600'
                            : h.score >= 7.0
                            ? 'text-indigo-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {h.score}/10
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE SPEAKING & SCORING STUDIO (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200 shadow-xl overflow-hidden relative">
            {/* Top decorative gradient bar */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <CardContent className="p-6 sm:p-8 space-y-7">
              {/* IF CUSTOM MODE: INPUT FIELDS */}
              {selectedPresetId === 'custom' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide">
                    Nhập từ hoặc câu tiếng Anh bạn muốn luyện:
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Ví dụ: Resilience, hoặc một câu hoàn chỉnh..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customIpa}
                      onChange={(e) => setCustomIpa(e.target.value)}
                      placeholder="Phiên âm IPA (tuỳ chọn, ví dụ /rɪˈzɪliəns/)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white"
                    />
                  </div>
                </div>
              )}

              {/* TARGET WORD / SENTENCE HERO DISPLAY */}
              <div className="text-center space-y-3 py-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                  <span>{currentItem.categoryLabel}</span>
                  <span>•</span>
                  <span>Mục tiêu THPT 2027</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  {currentItem.targetText}
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="font-mono text-base sm:text-lg text-indigo-600 font-bold bg-indigo-50/80 px-3.5 py-1 rounded-xl border border-indigo-100">
                    {currentItem.ipa}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                    {currentItem.meaningVi}
                  </span>
                </div>

                {currentItem.stressGuide && (
                  <div className="text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50/70 inline-block px-4 py-1.5 rounded-full border border-purple-200">
                    💡 Hướng dẫn trọng âm: {currentItem.stressGuide}
                  </div>
                )}

                {currentItem.contextSentence && (
                  <div className="pt-2 max-w-lg mx-auto text-xs sm:text-sm text-slate-500 font-medium italic">
                    "{currentItem.contextSentence}"
                    {currentItem.contextSentenceVi && (
                      <span className="block not-italic text-slate-400 mt-0.5">
                        ({currentItem.contextSentenceVi})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* ── STEP 1: NGHE AI ĐỌC MẪU ── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-blue-50/70 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-sm text-indigo-900">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>Bước 1: Nghe AI Đọc Mẫu Chuẩn Bản Xứ</span>
                  </div>
                  {isAiSpeaking && (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>AI đang đọc...</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => speakText(currentItem.targetText, 1.0)}
                    disabled={isAiSpeaking}
                    className="flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe Tốc Độ Chuẩn (1.0x)</span>
                  </button>

                  <button
                    onClick={() => speakText(currentItem.targetText, 0.75)}
                    disabled={isAiSpeaking}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-indigo-700 border border-indigo-200 font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    title="Nghe chậm để nghe rõ từng âm tiết và phụ âm đuôi"
                  >
                    <span>Nghe Chậm (0.75x) 🐢</span>
                  </button>

                  {isAiSpeaking && (
                    <button
                      onClick={stopAiSpeaking}
                      className="px-3 py-3 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold text-xs cursor-pointer"
                      title="Dừng phát âm"
                    >
                      <VolumeX className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-indigo-900/70 font-medium">
                  {currentItem.tip}
                </p>
              </div>

              {/* ── STEP 2: NGƯỜI HỌC REPEAT VÀO MICROPHONE ── */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 font-black text-sm text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Bước 2: Bấm Ghi Âm & Repeat Lại</span>
                </div>

                {/* Big Animated Microphone Button */}
                <div className="relative inline-block py-2">
                  {isListening && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                      <div className="absolute -inset-2 rounded-full bg-rose-500/15 animate-pulse" />
                    </>
                  )}
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center gap-1 text-white shadow-xl transition-all cursor-pointer transform active:scale-95 ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-200'
                        : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 ring-4 ring-indigo-100'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-8 h-8 animate-bounce" />
                        <span className="text-[11px] font-black tracking-wide">DỪNG LẠI</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-9 h-9" />
                        <span className="text-[11px] font-black tracking-wide">NÓI (REPEAT)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Live Audio Equalizer Bars when listening */}
                {isListening && (
                  <div className="flex items-center justify-center gap-1.5 h-8">
                    {[30, 60, 90, 45, 80, 50, 75].map((baseHeight, i) => {
                      const dynamicHeight = Math.max(
                        10,
                        Math.round((baseHeight * (audioVolume + 15)) / 100)
                      );
                      return (
                        <div
                          key={i}
                          style={{ height: `${dynamicHeight}px` }}
                          className="w-1.5 bg-gradient-to-t from-rose-500 to-purple-600 rounded-full transition-all duration-75"
                        />
                      );
                    })}
                  </div>
                )}

                {/* Status Indicator */}
                <div>
                  {isListening ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-600" />
                        <span>AI đang nghe bạn phát âm... Hãy nói to và rõ ràng nhé!</span>
                      </div>
                      {interimTranscript && (
                        <div className="text-sm font-semibold text-slate-700 italic">
                          "{interimTranscript}..."
                        </div>
                      )}
                    </div>
                  ) : isEvaluating ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      <span className="animate-spin">⏳</span>
                      <span>AI đang đối chiếu ngữ âm và chấm điểm...</span>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Nhấp vào micro, cấp quyền cho trình duyệt và phát âm từ/câu trên. AI sẽ tự động lắng nghe và chấm điểm.
                    </p>
                  )}
                </div>

                {/* Playback recorded user audio */}
                {userAudioUrl && !isListening && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 inline-flex items-center gap-3 text-xs font-bold text-slate-700 shadow-xs">
                    <span>🎙️ Nghe lại bản thu âm của bạn:</span>
                    <audio src={userAudioUrl} controls className="h-8 max-w-[220px]" />
                  </div>
                )}

                {/* Error Banner with 1-click troubleshooting */}
                {micPermissionError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs text-left space-y-2 animate-fade-in">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                      <div className="space-y-1 flex-1">
                        <div className="font-bold text-rose-800">Thông báo về Microphone:</div>
                        <div className="leading-relaxed">{micPermissionError}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/60">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowTroubleshooter(true)}
                        className="text-xs font-bold bg-white text-rose-700 border-rose-300 hover:bg-rose-100 cursor-pointer"
                      >
                        <Settings2 className="w-3.5 h-3.5 mr-1" />
                        Xem hướng dẫn mở Micro
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowManualInput(true)}
                        className="text-xs font-bold bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50 cursor-pointer"
                      >
                        <FileEdit className="w-3.5 h-3.5 mr-1" />
                        Nhập từ để chấm điểm
                      </Button>
                      <Button
                        size="sm"
                        onClick={startListening}
                        className="text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                        Thử lại
                      </Button>
                    </div>
                  </div>
                )}

                {/* MANUAL TEXT / SIMULATION FALLBACK */}
                {(showManualInput || !hasSpeechRecognition) && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-left space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-indigo-900 flex items-center gap-1.5">
                        <FileEdit className="w-4 h-4 text-indigo-600" />
                        Chế Độ Kiểm Tra Phát Âm (Dự Phòng Khi Mic Bị Lỗi)
                      </span>
                      <button
                        onClick={() => setShowManualInput(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        ✕ Đóng
                      </button>
                    </div>

                    <p className="text-xs text-indigo-950 font-medium">
                      Nếu micro máy tính bị hỏng hoặc chưa cấp quyền, bạn có thể nhập lại từ bạn vừa nói hoặc bấm chọn nhanh bên dưới để xem AI chấm điểm:
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={manualSpokenText}
                        onChange={(e) => setManualSpokenText(e.target.value)}
                        placeholder={`Nhập cách bạn đọc, ví dụ: ${currentItem.targetText.toLowerCase()}...`}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleManualEvaluate(manualSpokenText || currentItem.targetText)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Chấm Điểm
                      </Button>
                    </div>

                    {/* Quick test chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="text-slate-500 font-bold text-[11px]">Thử nghiệm:</span>
                      <button
                        onClick={() => handleManualEvaluate(currentItem.targetText)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        🎯 Đọc chuẩn 100% ({currentItem.targetText})
                      </button>
                      <button
                        onClick={() =>
                          handleManualEvaluate(
                            currentItem.targetText.slice(0, -1) // drop ending sound
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        ⚠️ Thiếu âm đuôi ({currentItem.targetText.slice(0, -1)})
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── STEP 3: CHẤM ĐIỂM THANG 10 & NHẬN XÉT CẢI THIỆN ── */}
              {result && (
                <div className="space-y-6 animate-fade-in border-t border-slate-200 pt-7">
                  <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      3
                    </span>
                    <span>Bước 3: Kết Quả Đánh Giá & Điểm Số Trên Thang 10</span>
                  </div>

                  {/* SCORE HERO BANNER */}
                  <div className={`p-6 rounded-3xl border ${result.gradeBg} flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm`}>
                    <div className="flex items-center gap-5 text-center sm:text-left">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-white shadow-md border border-slate-200/80 flex flex-col items-center justify-center">
                          <span className={`text-3xl sm:text-4xl font-black ${result.gradeColor}`}>
                            {result.score.toFixed(1)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 -mt-1">THANG 10</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className={`text-xs sm:text-sm font-black uppercase tracking-wider ${result.gradeColor}`}>
                          {result.score >= 9.0 ? '🌟 ĐỈNH CAO' : result.score >= 8.0 ? '🎯 ĐẠT CHUẨN 8+' : '🌱 CẦN RÈN LUYỆN'}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900">
                          {result.gradeLabel}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">
                          Độ khớp từ vựng: <strong className="text-slate-900">{result.accuracyPercent}%</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <Button
                        onClick={startListening}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Nói Lại</span>
                      </Button>
                      <Button
                        onClick={handleDeepGeminiAnalysis}
                        disabled={isLoadingGemini}
                        variant="outline"
                        size="sm"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50 font-bold gap-1.5 cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>{isLoadingGemini ? 'Đang hỏi AI...' : 'AI Nhận Xét'}</span>
                      </Button>
                    </div>
                  </div>

                  {/* TRANSCRIPT COMPARISON */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Âm thanh máy tính nghe được từ bạn:
                    </div>
                    <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
                      "{result.transcript}"
                    </div>

                    {/* Word-level highlights */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {result.wordAnalysis.map((item, idx) => (
                        <div
                          key={idx}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                            item.isMatch
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : item.similarity > 0.5
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-rose-50 border-rose-300 text-rose-800'
                          }`}
                        >
                          {item.isMatch ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{item.expectedWord}</span>
                          {!item.isMatch && (
                            <span className="text-[10px] opacity-75 font-normal">
                              ({item.word})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STRENGTHS & IMPROVEMENTS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                      <div className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Điểm bạn làm tốt
                      </div>
                      <ul className="text-xs space-y-1.5 text-emerald-950 font-medium">
                        {result.strengths.length > 0 ? (
                          result.strengths.map((str, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{str}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-emerald-700">Hãy tiếp tục luyện tập để cải thiện thêm!</li>
                        )}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                      <div className="text-xs font-black uppercase text-rose-900 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        Điểm cần khắc phục
                      </div>
                      <ul className="text-xs space-y-1.5 text-rose-950 font-medium">
                        {result.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-600 font-bold">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* PHONETIC MOUTH PLACEMENT GUIDELINES */}
                  {result.phoneticTips.length > 0 && (
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                      <div className="text-xs font-black uppercase text-indigo-900 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-indigo-600" />
                        Bí quyết khẩu hình chuẩn cho sĩ tử THPT
                      </div>
                      <div className="space-y-1.5 text-xs text-indigo-950 font-medium">
                        {result.phoneticTips.map((tip, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-white/80 border border-indigo-100 flex items-start gap-2">
                            <span className="font-bold text-indigo-600">💡</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DEEP GEMINI AI FEEDBACK */}
                  {geminiFeedback && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 space-y-3 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                          Nhận xét chuyên sâu từ Giám Khảo Gemini AI
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line bg-white/85 p-4 rounded-xl border border-purple-100">
                        {geminiFeedback}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
