import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Search, GitCompare, Zap, Shuffle, 
  AlertTriangle, Crosshair, Activity, Network, Layers, 
  Code2, Info 
} from 'lucide-react';

const DEFAULT_WIDTH = 340;
const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
const STORAGE_KEY = 'finserve_sidebar_width';

export function Sidebar() {
  const location = useLocation();
  const handleRef = useRef(null);

  // Initialize sidebar width from localStorage or default
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = parseInt(saved, 10);
    return !isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH ? parsed : DEFAULT_WIDTH;
  });

  const [isDragging, setIsDragging] = useState(false);

  // Synchronize CSS variable on root element whenever width changes
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', `${width}px`);
    localStorage.setItem(STORAGE_KEY, String(width));
  }, [width]);

  // Handle Dragging via Pointer Events
  const handlePointerDown = (e) => {
    e.preventDefault();
    if (handleRef.current) {
      handleRef.current.setPointerCapture(e.pointerId);
    }
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.body.classList.add('is-resizing');
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
    setWidth(newWidth);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    if (handleRef.current && e.pointerId) {
      try {
        handleRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore
      }
    }
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.body.classList.remove('is-resizing');
  };

  // Double click to reset to default
  const handleDoubleClick = () => {
    setWidth(DEFAULT_WIDTH);
  };

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setWidth(prev => Math.max(MIN_WIDTH, prev - 10));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setWidth(prev => Math.min(MAX_WIDTH, prev + 10));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setWidth(MIN_WIDTH);
    } else if (e.key === 'End') {
      e.preventDefault();
      setWidth(MAX_WIDTH);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navGroups = [
    {
      title: "Overview",
      accent: "brass",
      items: [
        { path: '/', label: 'Dashboard', num: '01', icon: LayoutDashboard }
      ]
    },
    {
      title: "Transaction Intelligence",
      accent: "brass",
      items: [
        { path: '/transaction-intelligence', label: 'Transaction Search', num: '02', icon: Search },
        { path: '/transaction-matching', label: 'Transaction Matching', num: '03', icon: GitCompare },
        { path: '/transaction-ranking', label: 'Transaction Ranking', num: '04', icon: Zap },
        { path: '/transaction-sampling', label: 'Transaction Sampling', num: '05', icon: Shuffle }
      ]
    },
    {
      title: "Fraud & Risk",
      accent: "sage",
      items: [
        { path: '/fraud-detection', label: 'Fraud Detection', num: '06', icon: AlertTriangle },
        { path: '/risk-coverage', label: 'Risk Coverage', num: '07', icon: Crosshair },
        { path: '/rule-validation', label: 'Rule Validation', num: '08', icon: Activity }
      ]
    },
    {
      title: "Network Analytics",
      accent: "clay",
      items: [
        { path: '/transaction-network', label: 'Transaction Network', num: '09', icon: Network },
        { path: '/case-assignment', label: 'Case Assignment', num: '10', icon: Layers }
      ]
    },
    {
      title: "Academic / DSA",
      accent: "focus",
      items: [
        { path: '/modules', label: 'Modules', num: '11', icon: Layers },
        { path: '/algorithms', label: 'Algorithms', num: '12', icon: Code2 },
        { path: '/comparison', label: 'Comparison', num: '13', icon: GitCompare },
        { path: '/analytics', label: 'Analytics', num: '14', icon: Activity },
        { path: '/about', label: 'About', num: '15', icon: Info }
      ]
    }
  ];

  return (
    <aside className="specimen-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-block">
        <div className="brand-logo-mark font-serif">F</div>
        <div className="brand-titles min-w-0">
          <h2 className="brand-name font-serif italic font-bold">FinServe</h2>
          <p className="brand-tagline font-mono uppercase tracking-widest text-dim truncate">
            Banking Intelligence Platform
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav-container">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className={`sidebar-group group-accent-${group.accent}`}>
            <div className="group-heading font-mono uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="group-dot shrink-0"></span>
                <span className="truncate">{group.title}</span>
              </div>
            </div>
            <ul className="group-list">
              {group.items.map((item, iIdx) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <li key={iIdx}>
                    <Link 
                      to={item.path} 
                      className={`nav-link ${active ? 'active' : ''}`}
                      title={item.label}
                    >
                      <span className="link-num font-mono shrink-0">{item.num}</span>
                      <Icon size={22} className="link-icon shrink-0" />
                      <span className="link-label truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer font-mono text-xs text-dim">
        <span className="footer-dot shrink-0"></span>
        <span className="truncate">15 modules · FinServe v1.0</span>
      </div>

      {/* Resizable Drag Handle */}
      <div 
        ref={handleRef}
        className={`sidebar-drag-handle ${isDragging ? 'dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize Sidebar"
        aria-valuenow={width}
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={MAX_WIDTH}
        tabIndex={0}
      />
    </aside>
  );
}

export default Sidebar;
