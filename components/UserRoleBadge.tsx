
import React from 'react';
import { ShieldCheck, GraduationCap, Crown, UserCheck } from 'lucide-react';

interface UserRoleBadgeProps {
  role: 'admin' | 'teacher' | 'moderator' | 'premium' | 'none';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role, size = 'md', showText = true, className = '' }) => {
  if (role === 'none') return null;

  const config = {
    admin: {
      icon: <ShieldCheck size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />,
      text: 'Admin',
      color: 'text-red-500 bg-red-50 border-red-100',
      iconColor: 'text-red-500'
    },
    moderator: {
      icon: <UserCheck size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />,
      text: 'Moderator',
      color: 'text-fun-orange bg-orange-50 border-orange-100',
      iconColor: 'text-fun-orange'
    },
    teacher: {
      icon: <GraduationCap size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />,
      text: 'Teacher',
      color: 'text-fun-blue bg-blue-50 border-blue-100',
      iconColor: 'text-fun-blue'
    },
    premium: {
      icon: <Crown size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />,
      text: 'Superpass',
      color: 'text-fun-yellow bg-yellow-50 border-yellow-100',
      iconColor: 'text-fun-yellow'
    }
  };

  const { icon, text, color, iconColor } = config[role as keyof typeof config];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-black uppercase tracking-tighter ${color} ${className} ${size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : 'text-xs'}`}>
      <span className={iconColor}>{icon}</span>
      {showText && <span>{text}</span>}
    </div>
  );
};

export default UserRoleBadge;
