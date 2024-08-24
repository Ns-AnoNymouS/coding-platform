import { useState } from 'react';

const useLanguage = () => {
  const [language, setLanguage] = useState('python');

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return { language, changeLanguage };
};

export default useLanguage;
