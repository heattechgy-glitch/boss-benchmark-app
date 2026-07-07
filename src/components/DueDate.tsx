import React from 'react';

interface DueDateProps {
  dueDate: string | Date;
  className?: string;
  showIcon?: boolean;
}

const DueDate: React.FC<DueDateProps> = ({ dueDate, className = '', showIcon = true }) => {
  const now = new Date();
  const due = new Date(dueDate);
  
  // Reset time to compare dates only
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateTime = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  
  const diffTime = dueDateTime.getTime() - nowDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isOverdue = diffDays < 0;
  const isDueToday = diffDays === 0;
  const isDueSoon = diffDays > 0 && diffDays <= 3;
  
  const getStatusClass = (): string => {
    if (isOverdue) return 'due-date--overdue';
    if (isDueToday) return 'due-date--today';
    if (isDueSoon) return 'due-date--soon';
    return 'due-date--normal';
  };
  
  const getStatusText = (): string => {
    if (isOverdue) {
      const daysOverdue = Math.abs(diffDays);
      return daysOverdue === 1 ? '1 day overdue' : `${daysOverdue} days overdue`;
    }
    if (isDueToday) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (isDueSoon) return `Due in ${diffDays} days`;
    return '';
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const statusText = getStatusText();
  
  return (
    <div className={`due-date ${getStatusClass()} ${className}`}>
      <style>{`
        .due-date {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .due-date--overdue {
          background-color: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        
        .due-date--overdue .due-date__icon {
          color: #dc2626;
        }
        
        .due-date--today {
          background-color: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }
        
        .due-date--today .due-date__icon {
          color: #d97706;
        }
        
        .due-date--soon {
          background-color: #fff7ed;
          color: #ea580c;
          border: 1px solid #fed7aa;
        }
        
        .due-date--soon .due-date__icon {
          color: #ea580c;
        }
        
        .due-date--normal {
          background-color: #f3f4f6;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }
        
        .due-date--normal .due-date__icon {
          color: #6b7280;
        }
        
        .due-date__icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        
        .due-date__content {
          display: flex;
          flex-direction: column;
          line-height: 1.3;
        }
        
        .due-date__date {
          font-weight: 600;
        }
        
        .due-date__status {
          font-size: 12px;
          font-weight: 400;
          opacity: 0.9;
        }
        
        .due-date--overdue .due-date__status {
          font-weight: 600;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .due-date--overdue {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
      
      {showIcon && (
        <svg 
          className="due-date__icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          {isOverdue && (
            <>
              <line x1="12" y1="14" x2="12" y2="17" />
              <circle cx="12" cy="19" r="0.5" fill="currentColor" />
            </>
          )}
        </svg>
      )}
      
      <div className="due-date__content">
        <span className="due-date__date">{formatDate(due)}</span>
        {statusText && <span className="due-date__status">{statusText}</span>}
      </div>
    </div>
  );
};

export default DueDate;