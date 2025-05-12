import React from 'react';
import './styles/Navbar.css';
import { Link } from 'react-router-dom';

const TABS = [
  { redirectTo: '../', label: 'Home' },
  { redirectTo: '../about', label: 'About' },
];

export default function Navbar({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="navbar-container">
      {TABS.map((tab, index) => (
        <div
          className={`nav-item${currentIndex === index ? '-bold' : ''}`}
          key={`nav-${index}`}
        >
          <Link to={tab.redirectTo}>{tab.label}</Link>
        </div>
      ))}
    </div>
  );
}
