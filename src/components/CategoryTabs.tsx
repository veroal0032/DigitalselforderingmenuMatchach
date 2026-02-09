import { motion } from 'motion/react';
import { Category, Language, translations } from '../lib/data';

interface CategoryTabsProps {
  language: Language;
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categories: Category[] = ['all', 'matcha', 'protein', 'coffee', 'snacks', 'sweets'];

export function CategoryTabs({ language, activeCategory, onSelectCategory }: CategoryTabsProps) {
  const t = translations[language];

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-6 md:px-12">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        
        return (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category)}
            className={`
              relative px-8 py-3 rounded-full font-sans-brand font-semibold text-lg whitespace-nowrap
              transition-all duration-300 flex-shrink-0
              ${
                isActive
                  ? 'bg-[#155020] text-white shadow-lg'
                  : 'bg-white text-[#155020] hover:bg-gray-50 shadow-md'
              }
            `}
          >
            {t.categories[category]}
            
            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#C8D96F] rounded-full"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}