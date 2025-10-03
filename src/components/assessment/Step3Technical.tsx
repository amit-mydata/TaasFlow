import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Code, Loader } from 'lucide-react';
import { submitSingleAnswerAPI } from '../../api/technicalAPI';

// ---------------------- //
//   TYPES
// ---------------------- //
type Question = {
  id: string;
  question: string;
  options?: string[]; // MCQ options
  type?: 'textarea' | 'mcq';
  points?: number;
};

type Section = {
  title: string;
  description: string;
  type: 'mcq' | 'scenario';
  questions: Question[];
};

type TechnicalResults = {
  score: number;
  totalScore: number;
  maxScore: number;
  breakdown: {
    experience: number;
    requirements: number;
    scenarios: number;
  };
};

type Step3TechnicalProps = {
  candidateId: string;
  technicalQuestions?: any[]; // ✅ API response questions
  onComplete: (result: {
    technicalScore: number;
    technicalResults: TechnicalResults;
    technicalAnswers: Record<string, string | number>;
  }) => void;
};

// ---------------------- //
//   COMPONENT
// ---------------------- //
const Step3Technical: React.FC<Step3TechnicalProps> = ({ candidateId, technicalQuestions = [], onComplete }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAPICalling, setIsAPICalling] = useState(false);

  const [results, setResults] = useState<TechnicalResults | null>(null);

  // ---------------------- //
  //   Map pre-fetched questions to Section[]
  // ---------------------- //
  useEffect(() => {
    if (technicalQuestions.length) {
      const mappedSections: Section[] = technicalQuestions.map((apiQuestion: any) => ({
        title: 'Technical Assessment',
        description: '',
        type: apiQuestion.options ? 'mcq' : 'scenario',
        questions: [{
          id: apiQuestion.quiz_id || `q${Math.random()}`,
          question: apiQuestion.question_text || apiQuestion.question || '',
          options: apiQuestion.options || undefined,
          type: apiQuestion.options ? 'mcq' : 'textarea',
          points: 10,
        }]
      }));
      setSections(mappedSections);
    }
  }, [technicalQuestions]);


  // ---------------------- //
  //   TIMER
  // ---------------------- //
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
const submitSingleAnswer = async (question: Question, answer: string | number) => {
  setIsAPICalling(true);
  const questionIndex =
    sections.slice(0, currentSection).reduce((sum, section) => sum + section.questions.length, 0) +
    currentQuestion;

  const type =
    questionIndex < 10
      ? 'mcqs_questions'
      : questionIndex < 15
      ? 'coding_questions'
      : 'text_questions';

  try {
    const res = await submitSingleAnswerAPI({
      type,
      quiz_id: question.id || '',
      candidate_uid: candidateId || '',
      user_answer: answer.toString(),
    });
    return res;
  } catch (err) {
    alert('Error submitting answer. Please try again.');
  } finally {
    setIsAPICalling(false);
  }
};



  // ---------------------- //
  //   ANSWER HANDLERS
  // ---------------------- //
  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (isAPICalling) return;
    const currentSectionData = sections[currentSection];
    const currentSectionQuestions = currentSectionData?.questions || [];

    if (currentQuestion < currentSectionQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setCurrentQuestion(sections[currentSection - 1]?.questions.length - 1 || 0);
    }
  };

  // ---------------------- //
  //   RESULTS CALCULATION
  // ---------------------- //
  const calculateResults = (): TechnicalResults => {
    let totalScore = 0;
    let maxScore = 0;

    sections.forEach(section => {
      section.questions.forEach(question => {
        maxScore += question.points || 0;
        const answer = answers[question.id];
        if (typeof answer === 'string' && answer.trim().length > 0) {
          totalScore += Math.floor((question.points || 0) * (0.6 + Math.random() * 0.4));
        }
      });
    });

    return {
      score: Math.round((totalScore / maxScore) * 100),
      totalScore,
      maxScore,
      breakdown: {
        experience: Math.floor(Math.random() * 20) + 75,
        requirements: Math.floor(Math.random() * 25) + 70,
        scenarios: Math.floor(Math.random() * 30) + 65,
      },
    };
  };

  // ---------------------- //
  //   SUBMIT
  // ---------------------- //
  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const results = calculateResults();
    setResults(results);

    setTimeout(() => {
      onComplete({
        technicalScore: results.score,
        technicalResults: results,
        technicalAnswers: answers,
      });
    }, 2000);
  };

  // ---------------------- //
  //   RENDER
  // ---------------------- //
  if (!sections.length) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-2xl font-bold">No Technical Questions Available</h2>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="p-8 text-center">
        {!results ? (
          <div>
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Results...</h2>
            <p className="text-gray-600">Analyzing your responses and calculating technical score</p>
          </div>
        ) : (
          <div>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
            <p className="text-gray-600 mb-8">Your technical assessment has been successfully submitted</p>

          </div>
        )}
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const currentQuestionData = currentSectionData?.questions?.[currentQuestion];
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const currentQuestionIndex =
    sections.slice(0, currentSection).reduce((sum, section) => sum + section.questions.length, 0) +
    currentQuestion;

  if (!currentSectionData || !currentQuestionData) return null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Technical Screening</h2>
          <p className="text-gray-600">Complete all sections to receive your technical assessment score</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-orange-600">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">Section: {currentSectionData.title}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Code className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-gray-600">Practical Exercise</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentQuestionData.question}</h3>
        {currentQuestionData.type === 'mcq' && currentQuestionData.options ? (
          <div className="space-y-3">
      {currentQuestionData.options.map((opt, idx) => (
        <label
          key={idx}
          className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-50 cursor-pointer"
        >
          <input
            type="radio"
            name={currentQuestionData.id}
            value={opt}
            checked={answers[currentQuestionData.id] === opt}
            onChange={() => handleAnswer(currentQuestionData.id, opt)}
            className="accent-blue-600 w-5 h-5"
          />
          <span className="text-gray-700 font-medium">{opt}</span>
        </label>
      ))}
    </div>
        ) : (
          <textarea
            value={(answers[currentQuestionData.id] as string) || ''}
            onChange={(e) => handleAnswer(currentQuestionData.id, e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
          />
        )}

      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentSection === 0 && currentQuestion === 0}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-4">
          {currentSection === sections.length - 1 &&
            currentQuestion === currentSectionData.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
            >
              Submit Assessment
            </button>
          ) : (
            <button
              onClick={async () => {
                const currentAnswer = answers[currentQuestionData.id];
                if (currentAnswer !== undefined && currentAnswer !== '') {
                  // submit current answer
                  await submitSingleAnswer(currentQuestionData, currentAnswer);
                }
                nextQuestion(); // then go to next question
              }}
              disabled={isAPICalling}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question
            </button>

          )}
        </div>
      </div>
    </div>
  );
};

export default Step3Technical;
