
import React from 'react';
import { useTranslation } from 'react-i18next';

const Roadmap = () => {
  const { t } = useTranslation();
  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">{t('roadmapSectionTitle')}</h2>
        <ul className="text-lg text-gray-600 max-w-2xl mx-auto space-y-4">
          <li>{t('roadmapMVP')}</li>
          <li>{t('roadmapQ2')}</li>
          <li>{t('roadmapQ3')}</li>
          <li>{t('roadmapQ4')}</li>
        </ul>
      </div>
    </section>
  );
};

export default Roadmap;
