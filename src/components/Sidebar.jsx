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
      <div className="flex items-center gap-1.5 px-6 mb-8 mt-2">
        <div className="w-[34px] h-[34px] flex-shrink-0">
          <img src="/favicon.svg" alt="App Icon" className="w-full h-full drop-shadow-sm" />
        </div>
        <div className="flex items-center">
          <img src="/gmtek-logo.svg" alt="GM TEK" className="h-[21px] drop-shadow-sm object-contain -ml-1" />
          <span className="text-[17px] font-bold text-gray-800 tracking-tight ml-1 mt-[2px]" style={{ fontFamily: 'Inter, sans-serif' }}>TalentConnect</span>
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
