import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Step1Resume from '../components/assessment/Step1Resume';
import Step2Communication from '../components/assessment/Step2Communication';
import Step3Technical from '../components/assessment/Step3Technical';
import ProgressBar from '../components/ProgressBar';
import { CheckCircle, FileText, Code } from 'lucide-react';
import {fetchQuizQuestionsAPI } from '../api/communicationAPI'

interface CandidateInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface AssessmentData {
  resume: File | null;
  jobDescription: string;
  resumeScore: number;
  communicationScore: number;
  technicalScore: number;
  candidateInfo: CandidateInfo;
  candidateId?: string;
  questions?: string[];
  technicalQuestions: any[];
  currentStep?: number;
  finalScore?: number;
}

interface Step {
  number: number;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  weight: string;
}

interface AssessmentProps {
  onComplete: (data: AssessmentData) => void;
}


const Assessment: React.FC<AssessmentProps> = ({ onComplete }) => {
  const navigate = useNavigate();

  // Restore from localStorage if available

const [assessmentData, setAssessmentData] = useState<AssessmentData>({
  resume: null,
  jobDescription: '',
  resumeScore: 0,
  communicationScore: 0,
  technicalScore: 0,
  technicalQuestions: [],
  candidateInfo: { name: '', email: '', phone: '' },
  questions: [],
  candidateId: undefined,
  currentStep: 1,
});

  // Persist assessmentData in localStorage
  const stepRoutes: Record<number, string> = {
    1: "resume",
    2: "communication",
    3: "technical",
    4: "result",
  };

  // Redirect based on progress or completion
useEffect(() => {
  const currentPath = window.location.pathname.split('/').pop();
  if (assessmentData.currentStep && assessmentData.currentStep <= 3) {
    const stepPath = stepRoutes[assessmentData.currentStep];
    if (currentPath !== stepPath) {
      navigate(stepPath, { replace: true });
    }
  }
}, [assessmentData.currentStep, navigate]);


  const steps: Step[] = [
    { number: 1, title: 'Resume & JD Matching', icon: FileText, weight: '40%' },
    // { number: 2, title: 'Communication Assessment', icon: Mic, weight: '20%' },
    { number: 2, title: 'Technical Screening', icon: Code, weight: '60%' },
  ];

const handleStepComplete = async (stepData: Partial<AssessmentData>, nextStep: number) => {
  const updatedData = { ...assessmentData, ...stepData };

  if (nextStep === 2) {
    try {
      const response = await fetchQuizQuestionsAPI(updatedData.candidateId || '');
      updatedData.technicalQuestions = response.data || [];
    } catch (err) {
      console.error('Error fetching technical questions:', err);
      alert('Could not fetch technical questions. Please try again.');
    }

    updatedData.currentStep = 3;
    setAssessmentData(updatedData);
    navigate('/assessment/technical');
    return;
  }

  if (nextStep <= 3) {
    updatedData.currentStep = nextStep;
    setAssessmentData(updatedData);
    navigate(`/assessment/${stepRoutes[nextStep]}`);
    return;
  }

  // Final step → calculate final score (in-memory only)
  updatedData.finalScore = Math.round(
    updatedData.resumeScore * 0.3 +
    updatedData.communicationScore * 0.2 +
    updatedData.technicalScore * 0.5
  );

  setAssessmentData(updatedData);
  onComplete(updatedData); // pass result to parent
  navigate('/results');
};



  const renderStepHeader = (currentStep: number) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Candidate Assessment</h1>
        <p className="text-gray-600">Complete all three stages to receive your comprehensive fit score</p>
      </div>

      <ProgressBar current={currentStep} total={steps.length} />

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center space-x-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${currentStep > step.number
                  ? 'bg-green-100 text-green-600'
                  : currentStep === step.number
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
            >
              {currentStep > step.number ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900">{step.title}</div>
              <div className="text-xs text-gray-500">Weight: {step.weight}</div>
            </div>

            {/* {index < steps.length - 1 && (
              <div className="hidden lg:block w- h-px bg-gray-200 mx-4"></div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Routes>
        <Route
          path="resume"
          element={
            <>
              {renderStepHeader(1)}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <Step1Resume
                  data={assessmentData}
                  onComplete={(data) => handleStepComplete(data, 2)}
                />
              </div>
            </>
          }
        />
        <Route
          path="communication"
          element={
            <>
              {renderStepHeader(2)}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <Step2Communication
                  data={{
                    candidateId: assessmentData.candidateId || '',
                    questions: assessmentData.questions || [],
                  }}
                  onComplete={(result) =>
                    handleStepComplete(
                      {
                        communicationScore: result.communicationScore,
                        technicalQuestions: result.technicalQuestions,
                      },
                      3
                    )
                  }
                />
              </div>
            </>
          }
        />
        <Route
          path="technical"
          element={
            <>
              {renderStepHeader(2)}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <Step3Technical
                  candidateId={assessmentData.candidateId || ''}
                  technicalQuestions={assessmentData.technicalQuestions || []}
                  onComplete={(result) =>
                    handleStepComplete(
                      { technicalScore: result.technicalScore },
                      4 // completed → results
                    )
                  }
                />
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default Assessment;
