import React from 'react';
import { FiMapPin, FiBriefcase, FiBookmark, FiEye, FiFileText, FiMail } from 'react-icons/fi';

const CandidateCard = ({ candidate, onViewProfile }) => {
  const { name, role, location, experience, salaryRange, skills, noticePeriod } = candidate;

  // For demo purposes, we'll randomize or use specific values for the status badge
  const statusDays = noticePeriod === 'Immediate' ? 'Immediate' : noticePeriod.split(' ')[0] + ' days';

  return (
    <div 
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col h-full relative"
      onClick={onViewProfile}
    >
      <div className="p-5 flex-1">
        <div className="flex gap-4 mb-4">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-bold text-gray-800 leading-tight truncate">{name}</h3>
            <p className="text-gray-500 text-sm mt-0.5">{role || candidate.jobRole}</p>
          </div>
        </div>

        <div className="space-y-2 mb-6 text-gray-400 text-xs font-medium">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-gray-300" /> {location}
          </div>
          <div className="flex items-center gap-2">
            <FiBriefcase className="text-gray-300" /> {experience}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-2">
            <span className="bg-gray-50 text-gray-500 text-[10px] px-2 py-0.5 rounded-full w-max border border-gray-100">{statusDays}</span>
            <div className="flex gap-1.5 flex-wrap">
              {skills.slice(0, 2).map((skill, index) => (
                <span key={index} className="bg-blue-50/50 text-blue-500 text-[10px] px-2 py-0.5 rounded border border-blue-50">{skill}</span>
              ))}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Salary</p>
            <p className="text-xl font-black text-green-600 leading-none">
              {(() => {
                const s = salaryRange || candidate.expectedSalary || '8';
                if (typeof s === 'string' && s.includes('-')) {
                  return s.split('-').map(part => {
                    const num = parseInt(part.replace(/[^0-9]/g, ''));
                    return num >= 100000 ? Math.round(num/100000) : part;
                  }).join('-');
                }
                const num = parseInt(s.toString().replace(/[^0-9]/g, ''));
                return num >= 100000 ? Math.round(num/100000) : s;
              })()} <span className="text-sm font-bold">LPA</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/40 text-blue-600 text-[11px] font-bold py-2.5 text-center border-t border-gray-50 rounded-b-2xl group-hover:bg-blue-50 transition-colors">
        Click to view full profile & contact info
      </div>
    </div>
  );
};

export default CandidateCard;
