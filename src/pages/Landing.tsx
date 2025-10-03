import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Mic, Code, TrendingUp, CheckCircle, Clock, Users } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: "Resume-JD Matching",
      description: "AI-powered analysis comparing candidate resumes against job descriptions with 95% accuracy",
      weight: "30%"
    },
    {
      icon: Mic,
      title: "Communication Assessment",
      description: "Automated speech analysis measuring fluency, clarity, and professionalism",
      weight: "20%"
    },
    {
      icon: Code,
      title: "Technical Screening",
      description: "Dynamic MCQs and coding challenges tailored to candidate experience and JD requirements",
      weight: "50%"
    }
  ];

  const stats = [
    { label: "Candidates Assessed", value: "12,847", icon: Users },
    { label: "Average Processing Time", value: "8 mins", icon: Clock },
    { label: "Accuracy Rate", value: "94.2%", icon: CheckCircle },
    { label: "Client Satisfaction", value: "97%", icon: TrendingUp }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            AI-Powered Candidate Assessment Platform
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Transform Your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Hiring Process
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline consultant pre-vetting with our multi-stage assessment system. 
            Get comprehensive fit scores, reduce hiring time by 60%, and make data-driven decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/assessment"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Multi-Stage Assessment System
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive vetting process evaluates candidates across three critical dimensions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {feature.weight}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Flow Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple 4-step process to get comprehensive candidate insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Upload Resume", desc: "Candidate uploads resume and JD is provided" },
              { step: "02", title: "HR Screening", desc: "Communication assessment via audio/video" },
              { step: "03", title: "Technical Test", desc: "Auto-generated MCQs and coding challenges" },
              { step: "04", title: "Fit Score", desc: "AI calculates final weighted assessment score" }
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to revolutionize your hiring?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands of companies using ConsultantVet Pro to make better hiring decisions
          </p>
          
          <Link
            to="/assessment"
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Start Your First Assessment
            <ArrowRight className="ml-3 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;