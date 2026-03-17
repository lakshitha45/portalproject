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
    { name: 'Job Management', icon: <FiBriefcase />, path: '#' },
    { name: 'Find Candidates', icon: <FiUsers />, path: '#', active: true },
    { name: 'Applications', icon: <FiFileText />, path: '#' },
    { name: 'Analytics', icon: <FiBarChart2 />, path: '#' },
    { name: 'Company Profile', icon: <FiUser />, path: '#' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="var(--primary-color)" fillOpacity="0.1" />
            <path d="M12 8V16M8 12H16" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="brand-name">GM TEK <span>TalentConnect</span></h1>
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
