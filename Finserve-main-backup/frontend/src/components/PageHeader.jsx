import React from 'react';

export function PageHeader({ eyebrow, title, subtitle, meta, children }) {
  return (
    <header className="specimen-page-header reveal-on-scroll">
      <div className="header-top mb-3">
        {eyebrow && (
          <div className="header-eyebrow font-mono text-xs uppercase tracking-wider text-brass mb-2">
            <span className="eyebrow-line"></span> {eyebrow}
          </div>
        )}
        <h1 className="header-title font-serif italic text-4xl mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="header-subtitle text-paper-dim text-base max-w-4xl mb-0">
            {subtitle}
          </p>
        )}
      </div>

      {(meta || children) && (
        <div className="header-controls-row flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-line">
          {meta && (
            <div className="header-meta font-mono text-xs text-dim flex flex-wrap items-center gap-3">
              {meta}
            </div>
          )}
          {children && (
            <div className="header-actions flex flex-wrap items-center gap-3 flex-1 justify-end">
              {children}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
