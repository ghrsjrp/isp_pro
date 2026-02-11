
import React from 'react';
import { Status } from '../types';

interface StatusBadgeProps {
  status: string | Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = status.toUpperCase();
  
  const getStyles = () => {
    switch (s) {
      case 'UP':
      case 'PRODUCTION':
      case 'SIM':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'DOWN':
      case 'NAO':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'PENDING':
      case 'LAB':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
