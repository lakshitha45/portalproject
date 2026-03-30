import React from 'react';
import { 
  FiUsers
} from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { name: 'Find Candidates', icon: <FiUsers />, path: '#', active: true },
  ];

  return (
    <aside className="sidebar fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-100 flex flex-col pt-6 pb-4 transition-all z-40">
      {/* Brand Logo Section */}
      <div className="flex items-center gap-2.5 px-6 mb-8">
        <div className="w-8 h-8 flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
            <circle cx="5" cy="12" r="3" fill="#f59e0b" />
            <circle cx="11" cy="7" r="3" fill="#06b6d4" />
            <circle cx="11" cy="17" r="3" fill="#84cc16" />
            <circle cx="17" cy="12" r="4" fill="#22d3ee" />
          </svg>
        </div>
        <div className="flex items-baseline gap-1 whitespace-nowrap overflow-hidden">
          <span className="text-lg font-bold text-gray-800 tracking-tight">GM TEK</span>
          <span className="text-lg font-medium text-gray-500 tracking-tight">TalentConnect</span>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map((item, index) => (
          <a 
            key={index} 
            href={item.path} 
            className={`
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group
              ${item.active 
                ? 'bg-blue-50/80 text-blue-600 shadow-sm border-l-[3px] border-blue-600 pl-2' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <span className={`text-[19px] transition-colors ${item.active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-700'}`}>
              {item.icon}
            </span>
            <span className="tracking-wide">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
