import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-[#12121c] border border-gray-200 dark:border-white/10 shadow-lg text-gray-800 dark:text-gray-200 hover:scale-110 transition-all duration-200 z-50 flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={24} className="text-amber-500" /> : <Moon size={24} className="text-indigo-500" />}
    </button>
  );
}
