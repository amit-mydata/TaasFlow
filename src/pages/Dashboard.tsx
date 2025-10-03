import React, { useState } from 'react';
import { Search, Filter, Download, MoreVertical, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  date: string;
  finalScore: number;
  status: 'strong-fit' | 'potential-fit' | 'not-fit';
  resumeScore: number;
  communicationScore: number;
  technicalScore: number;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'strong-fit' | 'potential-fit' | 'not-fit'>('all');

  const mockCandidates: Candidate[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      position: 'Senior React Developer',
      date: '2024-01-15',
      finalScore: 87,
      status: 'strong-fit',
      resumeScore: 92,
      communicationScore: 85,
      technicalScore: 84
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      position: 'Full Stack Engineer',
      date: '2024-01-14',
      finalScore: 73,
      status: 'potential-fit',
      resumeScore: 78,
      communicationScore: 82,
      technicalScore: 68
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      position: 'DevOps Consultant',
      date: '2024-01-13',
      finalScore: 91,
      status: 'strong-fit',
      resumeScore: 88,
      communicationScore: 94,
      technicalScore: 92
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@email.com',
      position: 'Backend Developer',
      date: '2024-01-12',
      finalScore: 56,
      status: 'not-fit',
      resumeScore: 65,
      communicationScore: 52,
      technicalScore: 51
    },
    {
      id: 5,
      name: 'Lisa Wang',
      email: 'lisa.wang@email.com',
      position: 'UI/UX Consultant',
      date: '2024-01-11',
      finalScore: 82,
      status: 'strong-fit',
      resumeScore: 86,
      communicationScore: 89,
      technicalScore: 77
    }
  ];

  const stats: Stat[] = [
    { label: 'Total Assessments', value: '247', change: '+12%', icon: Users },
    { label: 'Strong Fit Rate', value: '38%', change: '+5%', icon: CheckCircle },
    { label: 'Avg. Processing Time', value: '8.2 min', change: '-15%', icon: Clock },
    { label: 'Client Satisfaction', value: '94.2%', change: '+2%', icon: TrendingUp }
  ];

  const getStatusColor = (status: Candidate['status']): string => {
    switch (status) {
      case 'strong-fit': return 'bg-green-100 text-green-800';
      case 'potential-fit': return 'bg-yellow-100 text-yellow-800';
      case 'not-fit': return 'bg-red-100 text-red-800';
    }
  };

  const getStatusLabel = (status: Candidate['status']): string => {
    switch (status) {
      case 'strong-fit': return 'Strong Fit';
      case 'potential-fit': return 'Potential Fit';
      case 'not-fit': return 'Not a Fit';
    }
  };

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || candidate.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Dashboard</h1>
        <p className="text-gray-600">Monitor and analyze candidate assessment performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">{stat.change}</span>
                  <span className="text-gray-600 ml-1">vs last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="strong-fit">Strong Fit</option>
                <option value="potential-fit">Potential Fit</option>
                <option value="not-fit">Not a Fit</option>
              </select>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Assessments ({filteredCandidates.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Communication</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Technical</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-500">{candidate.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{candidate.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      candidate.finalScore >= 80 ? 'bg-green-100 text-green-800' :
                      candidate.finalScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {candidate.finalScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{candidate.resumeScore}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{candidate.communicationScore}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{candidate.technicalScore}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                      {getStatusLabel(candidate.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(candidate.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No candidates found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
