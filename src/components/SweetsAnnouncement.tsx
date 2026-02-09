import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import { Language, translations } from '../lib/data';

interface SweetsAnnouncementProps {
  language: Language;
}

export function SweetsAnnouncement({ language }: SweetsAnnouncementProps) {
  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full"
    >
      <div className="bg-[#C8D96F]/20 border-2 border-[#C8D96F] rounded-3xl p-8 md:p-12">
        <div className="flex items-start gap-4">
          <div className="bg-[#C8D96F] rounded-full p-3 flex-shrink-0">
            <Info className="w-6 h-6 text-[#155020]" />
          </div>
          <div>
            <h3 className="font-serif-brand text-2xl text-[#155020] mb-3">
              {language === 'en' ? 'Our Sweets Selection' : 'Nuestra Selección de Dulces'}
            </h3>
            <p className="font-sans-brand text-lg text-[#155020]/80 leading-relaxed">
              {t.sweets.announcement}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
