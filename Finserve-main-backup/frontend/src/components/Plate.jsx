import React from 'react';

export function PlateTag({ children, variant = 'brass' }) {
  return (
    <span className={`plate-tag plate-tag-${variant} font-mono text-xs uppercase px-3 py-1 rounded-full border shrink-0`}>
      {children}
    </span>
  );
}

export function Plate({ 
  number, 
  title, 
  description, 
  tag, 
  tagVariant = 'brass',
  watermark,
  icon: Icon, 
  className = '', 
  children,
  headerAction,
  accent = 'brass'
}) {
  const displayWatermark = watermark || (number ? String(number).padStart(2, '0') : null);

  return (
    <div 
      className={`specimen-plate plate-accent-${accent} ${className}`}
      data-watermark={displayWatermark || ''}
    >
      {(title || number || tag || Icon || headerAction) && (
        <div className="plate-header flex items-center gap-3 pb-4 mb-4 border-b border-line">
          {number && (
            <span className="plate-num-badge font-mono font-bold text-sm rounded-full flex items-center justify-center shrink-0" style={{ width: '2.5rem', height: '2.5rem', background: 'var(--brass)', color: 'var(--ink)' }}>
              {String(number).padStart(2, '0')}
            </span>
          )}

          <div className="plate-title-col flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-0.5">
              {Icon && <Icon size={20} className="text-brass shrink-0 inline-block" />}
              {title && <h3 className="plate-title font-serif text-xl text-paper font-semibold leading-tight mb-0 inline-block">{title}</h3>}
            </div>
            {description && <p className="plate-desc text-sm text-paper-dim mb-0 leading-normal">{description}</p>}
          </div>

          {(tag || headerAction) && (
            <div className="plate-header-right flex items-center gap-2.5 ml-auto shrink-0 self-center">
              {tag && <PlateTag variant={tagVariant}>{tag}</PlateTag>}
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className="plate-content">
        {children}
      </div>
    </div>
  );
}

export default Plate;
