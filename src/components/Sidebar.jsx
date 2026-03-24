import React from 'react';
import { 
  FiGrid, 
  FiBriefcase, 
  FiUsers, 
  FiFileText, 
  FiBarChart2, 
  FiUser 
} from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: <FiGrid />, path: '#' },
    { name: 'Find Candidates', icon: <FiUsers />, path: '#', active: true },
    { name: 'Upload Resume', icon: <FiFileText />, path: '#' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header-h">
        <div className="logo-icon-v3">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="12" r="3" fill="#f59e0b" />
            <circle cx="11" cy="7" r="3" fill="#06b6d4" />
            <circle cx="11" cy="17" r="3" fill="#84cc16" />
            <circle cx="17" cy="12" r="4" fill="#22d3ee" />
          </svg>
        </div>
        <div className="brand-container-h">
          <span className="brand-gm">GM TEK</span>
          <span className="brand-connect-h">TalentConnect</span>
        </div>
      </div>
      
      <nav className="nav-menu">
        {navItems.map((item, index) => (
          <a 
            key={index} 
            href={item.path} 
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
