import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  TrendingUp,
  Award
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { fetchTechnicalResultsAPI } from '../api/resultAPI';

interface CandidateInfo {
  name: string;
  email: string;
  phone?: string;
}

interface ResumeAnalysis {
  matchedSkills: string[];
  missingSkills: string[];
  highlights: string[];
}

// interface CommunicationMetrics {
//   averageResponseTime: string;
//   speechRate: string;
//   fillerWords: string;
//   confidence: string;
// }

// interface CommunicationAnalysis {
//   fluency: number;
//   clarity: number;
//   professionalism: number;
//   metrics: CommunicationMetrics;
//   feedback: string[];
// }

interface TechnicalBreakdown {
  experience: number;
  requirements: number;
  scenarios: number;
}

interface TechnicalResults {
  breakdown: TechnicalBreakdown;
  overallScore: number;
}

interface Candidate {
  candidateInfo: CandidateInfo;
  finalScore: number;
  resumeScore: number;
  communicationScore?: number;
  technicalScore: number;
  resumeAnalysis?: ResumeAnalysis;
  // communicationAnalysis?: CommunicationAnalysis;
  technicalResults?: TechnicalResults;
  
}

const Results: React.FC = () => {
  const candidateId = useParams().candidateId || localStorage.getItem('candidateId');
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token'); // ✅ get saved token
      if (!token) {
        alert('Please login again.');
        return;
      }

      const technicalRes = await fetchTechnicalResultsAPI(candidateId!, token); // pass token
      const apiData = technicalRes.data;

      const resumeAnalysis: ResumeAnalysis = {
        matchedSkills: apiData.analyze_answer_response.matched_skills,
        missingSkills: apiData.analyze_answer_response.missing_skills,
        highlights: apiData.analyze_answer_response.key_highlights,
      };

        // const communicationAnalysis: CommunicationAnalysis = {
        //   fluency: apiData.communication_data.fluency,
        //   clarity: apiData.communication_data.clarity,
        //   professionalism: apiData.communication_data.professionalism,
        //   metrics: {
        //     averageResponseTime: apiData.communication_data.key_metrics.response_time + 's',
        //     fillerWords: apiData.communication_data.key_metrics.filler_words.toString(),
        //     speechRate: apiData.communication_data.key_metrics.speech_rate + ' wpm',
        //     confidence: apiData.communication_data.key_metrics.confidence_level
        //   },
        //   feedback: apiData.communication_data.feedback
        // };

         const technicalResults: TechnicalResults = {
        breakdown: {
          experience: apiData.teachnical_data.experience_based,
          requirements: Math.round(apiData.teachnical_data.coding_percentage * 100),
          scenarios: Math.round(apiData.teachnical_data.text_percentage * 100),
        },
        overallScore: apiData.teachnical_data.overall_score,
      };

      const finalScore = Math.round(
        0.3 * apiData.analyze_answer_response.match_score +
        // 0.2 * apiData.communication_data.communication_score +
        0.5 * apiData.teachnical_data.overall_score
      );

      const candidateData = apiData.candidate_data;

      setCandidate({
        candidateInfo: {
          name: candidateData.candidate_name,
          email: candidateData.email,
        },
        finalScore,
        resumeScore: apiData.analyze_answer_response.match_score,
        // communicationScore: apiData.communication_data.communication_score,
        technicalScore: apiData.teachnical_data.overall_score,
        resumeAnalysis,
        // communicationAnalysis,
        technicalResults,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchResults();
}, [candidateId]);

  if (loading) return <div className="text-center py-16">Loading results...</div>;

  if (!candidate)
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">No Assessment Data</h2>
          <p className="text-yellow-700 mb-6">Please complete an assessment first to view results.</p>
          <Link
            to="/assessment"
            className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getFitRecommendation = (score: number) => {
    if (score >= 80) return { label: 'Strong Fit', desc: 'Proceed to Client Interview', icon: CheckCircle, color: 'green' };
    if (score >= 60) return { label: 'Potential Fit', desc: 'Needs Additional Review', icon: AlertTriangle, color: 'yellow' };
    return { label: 'Not a Fit', desc: 'Consider Other Candidates', icon: XCircle, color: 'red' };
  };

  const recommendation = getFitRecommendation(candidate.finalScore);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/assessment/resume"
            onClick={() => {
              localStorage.removeItem('assessmentData');
              localStorage.removeItem('assessmentComplete');
              localStorage.removeItem('candidateId');
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Assessment</span>
          </Link>

      
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{candidate.candidateInfo.name}</h1>
            <p className="text-gray-600">{candidate.candidateInfo.email}</p>
            {candidate.candidateInfo.phone && (
              <p className="text-gray-500 text-sm">{candidate.candidateInfo.phone}</p>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Assessment Completed</div>
            <div className="text-gray-900 font-medium">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${getScoreBgColor(candidate.finalScore)}`}>
              {candidate.finalScore}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900">Overall Fit Score</div>
              <div className={`text-lg font-semibold ${getScoreColor(candidate.finalScore)}`}>
                {recommendation.label}
              </div>
            </div>
          </div>

          <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-${recommendation.color}-800 bg-${recommendation.color}-100`}>
            <recommendation.icon className="w-5 h-5" />
            <span className="font-semibold">{recommendation.desc}</span>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Resume */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">Resume Match</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{candidate.resumeScore}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${candidate.resumeScore}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-600">Weight: 40%</p>
          <p className="text-xs text-gray-500 mt-2">AI-powered resume to JD matching</p>
        </div>

        {/* Communication */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-medium text-gray-900">Communication</span>
            </div>
            <span className="text-2xl font-bold text-green-600">{candidate.communicationScore}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${candidate.communicationScore}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-600">Weight: 20%</p>
          <p className="text-xs text-gray-500 mt-2">Fluency, clarity & professionalism</p>
        </div> */}

        {/* Technical */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium text-gray-900">Technical</span>
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {candidate.technicalScore.toFixed(2)}%
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${candidate.technicalScore}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-600">Weight: 60%</p>
          <p className="text-xs text-gray-500 mt-2">MCQs, coding & case studies</p>
        </div>
      </div>

      {/* Resume Analysis */}
      {candidate.resumeAnalysis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Analysis</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Matched Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.resumeAnalysis.matchedSkills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {candidate.resumeAnalysis.missingSkills.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Areas for Development</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.resumeAnalysis.missingSkills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Highlights</h4>
              <ul className="space-y-1">
                {candidate.resumeAnalysis.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Communication Analysis */}
      {/* {candidate.communicationAnalysis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Assessment</h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{candidate.communicationAnalysis.fluency}</div>
              <div className="text-xs text-gray-600">Fluency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{candidate.communicationAnalysis.clarity}</div>
              <div className="text-xs text-gray-600">Clarity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{candidate.communicationAnalysis.professionalism}</div>
              <div className="text-xs text-gray-600">Professional</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="font-medium">{candidate.communicationAnalysis.metrics.averageResponseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speech Rate:</span>
                  <span className="font-medium">{candidate.communicationAnalysis.metrics.speechRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filler Words:</span>
                  <span className="font-medium">{candidate.communicationAnalysis.metrics.fillerWords}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-medium">{candidate.communicationAnalysis.metrics.confidence}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Technical Results */}
      {candidate.technicalResults && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Assessment Results</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{candidate.technicalResults.breakdown.experience}%</div>
              <div className="text-sm text-gray-700">Experience-Based</div>
              <div className="text-xs text-gray-500">Questions from resume</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">{candidate.technicalResults.breakdown.requirements}%</div>
              <div className="text-sm text-gray-700">Job Requirements</div>
              <div className="text-xs text-gray-500">JD-specific questions</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">{candidate.technicalResults.breakdown.scenarios}%</div>
              <div className="text-sm text-gray-700">Scenario-Based</div>
              <div className="text-xs text-gray-500">Case studies & coding</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
