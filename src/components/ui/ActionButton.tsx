'use client';

type ActionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function ActionButton({ children, onClick }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      {children}
    </button>
  );
} 