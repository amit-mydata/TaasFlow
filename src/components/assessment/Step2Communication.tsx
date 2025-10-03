import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, CheckCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeCommunicationAPI, fetchQuizQuestionsAPI } from '../../api/communicationAPI';

/* -------------------------------
   Types
-------------------------------- */
interface Step2CommunicationProps {
  data: {
    questions: string[]; // dynamic questions from Step 1
    candidateId: string;
  };
  onComplete: (result: {
    communicationScore: number;
    communicationAnalysis: AnalysisResult;
    audioRecording: string;
    technicalQuestions?: any[];
  }) => void;
}

interface AnalysisMetrics {
  averageResponseTime: string;
  fillerWords: number;
  speechRate: string;
  confidence: string;
}

interface AnalysisResult {
  score: number;
  fluency: number;
  clarity: number;
  professionalism: number;
  metrics: AnalysisMetrics;
  feedback: string[];
}

/* -------------------------------
   Component
-------------------------------- */
const Step2Communication: React.FC<Step2CommunicationProps> = ({ data, onComplete }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  const questions: string[] = data.questions || [];
  const navigate = useNavigate();

  /* -------------------------------
      Recording Handlers
  -------------------------------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        audioBlobRef.current = audioBlob;
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to continue with the assessment.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    audioBlobRef.current = null;
    setIsPlaying(false);
  };

  /* -------------------------------
      Real API Call
  -------------------------------- */
 const analyzeCommunication = async () => {
  if (!audioBlobRef.current) return;
  setIsAnalyzing(true);

  try {
    const audioFile = new File([audioBlobRef.current], `que${currentQuestion + 1}.mp3`, {
      type: 'audio/mpeg',
    });

    const result = await analyzeCommunicationAPI({
      candidateId: data.candidateId,
      questions,
      audioFile,
    });

    if (result?.status && result?.data) {
      const mapped: AnalysisResult = {
        score: result.data.communication_score,
        fluency: result.data.fluency,
        clarity: result.data.clarity,
        professionalism: result.data.professionalism,
        metrics: {
          averageResponseTime: `${result.data.key_metrics.response_time}s`,
          fillerWords: result.data.key_metrics.filler_words,
          speechRate: `${result.data.key_metrics.speech_rate} wpm`,
          confidence: result.data.key_metrics.confidence_level,
        },
        feedback: result.data.feedback,
      };

      setAnalysisResult(mapped);
    }
  } catch (err) {
    console.error('Analysis error:', err);
    alert('Error analyzing communication. Please try again.');
  } finally {
    setIsAnalyzing(false);
  }
};

const handleSubmit = async () => {
  if (recordedAudio && !analysisResult) {
    analyzeCommunication();
  } else if (analysisResult && recordedAudio) {
    try {
      const quizData = await fetchQuizQuestionsAPI(data.candidateId);

      onComplete({
        communicationScore: analysisResult.score,
        communicationAnalysis: analysisResult,
        audioRecording: recordedAudio,
        technicalQuestions: quizData.data || [],
      });

      navigate('/assessment/technical');
    } catch (err) {
      console.error('Error fetching quiz questions:', err);
      alert('Could not fetch technical questions. Please try again.');
    }
  }
};

  /* -------------------------------
      Question Navigation
  -------------------------------- */
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      resetRecording();
      setAnalysisResult(null);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      resetRecording();
      setAnalysisResult(null);
    }
  };

  /* -------------------------------
      JSX (UI unchanged)
  -------------------------------- */
  return (
    <div className="p-8">
      {/* --- HEADER --- */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Communication Assessment</h2>
        <p className="text-gray-600">
          Record your responses to assess communication skills, fluency, and professionalism
        </p>
      </div>

      {/* --- Progress --- */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="text-sm text-gray-500">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* --- Current Question --- */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Question {currentQuestion + 1}</h3>
        <p className="text-blue-800">{questions[currentQuestion]}</p>
      </div>

      {/* --- Recording UI --- */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center mb-8">
        {!recordedAudio ? (
          <div>
            <div
              className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                isRecording
                  ? 'bg-red-100 animate-pulse'
                  : 'bg-blue-100 hover:bg-blue-200 cursor-pointer'
              }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <MicOff className="w-10 h-10 text-red-600" />
              ) : (
                <Mic className="w-10 h-10 text-blue-600" />
              )}
            </div>

            <p className="text-lg font-semibold text-gray-900 mb-2">
              {isRecording ? 'Recording...' : 'Click to Start Recording'}
            </p>
            <p className="text-gray-600">
              {isRecording
                ? 'Click the microphone again to stop recording'
                : 'Take 1-2 minutes to answer the question above'}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={playAudio}
                className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center text-green-600 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button
                onClick={resetRecording}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>

            <audio
              ref={audioRef}
              src={recordedAudio}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            <p className="text-lg font-semibold text-gray-900 mb-2">Recording Complete</p>
            <p className="text-gray-600">Play to review or re-record if needed</p>
          </div>
        )}
      </div>

      {/* --- Navigation --- */}
      <div className="flex justify-between mb-8">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Question
        </button>

        <button
          onClick={nextQuestion}
          disabled={currentQuestion === questions.length - 1 || !recordedAudio}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Question
        </button>
      </div>

      {/* --- Analysis --- */}
      {isAnalyzing && (
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            <div>
              <h3 className="font-semibold text-blue-900">Analyzing Communication...</h3>
              <p className="text-blue-700">
                AI is evaluating fluency, clarity, and professionalism
              </p>
            </div>
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Communication Analysis</h3>
            <div className="flex items-center space-x-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  analysisResult.score >= 80
                    ? 'bg-green-500'
                    : analysisResult.score >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              >
                {analysisResult.score}
              </div>
              <span className="text-sm text-gray-600">Communication Score</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysisResult.fluency}</div>
              <div className="text-sm text-gray-600">Fluency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analysisResult.clarity}</div>
              <div className="text-sm text-gray-600">Clarity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analysisResult.professionalism}
              </div>
              <div className="text-sm text-gray-600">Professionalism</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Key Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="font-medium">{analysisResult.metrics.averageResponseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filler Words:</span>
                  <span className="font-medium">{analysisResult.metrics.fillerWords}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speech Rate:</span>
                  <span className="font-medium">{analysisResult.metrics.speechRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Level:</span>
                  <span className="font-medium">{analysisResult.metrics.confidence}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Feedback</h4>
              <ul className="space-y-2">
                {analysisResult.feedback.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- Submit --- */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!recordedAudio || isAnalyzing}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isAnalyzing
            ? 'Analyzing...'
            : analysisResult
            ? 'Continue to Technical Assessment'
            : 'Analyze Communication'}
        </button>
      </div>
    </div>
  );
};

export default Step2Communication;
