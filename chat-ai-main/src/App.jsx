import React, { useState } from 'react';
import Mainbot from './components/Mainbot';
import Languages from './components/Languages';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(''); // Default language

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Side: Languages Component */}
      <div className="w-full md:w-1/6 bg-gray-200 p-4 border-b md:border-r border-gray-300 overflow-hidden">
        <Languages onLanguageChange={handleLanguageChange} />
      </div>
      {/* Right Side: Mainbot Component */}
      <div className="w-full md:w-5/6 p-4 overflow-hidden">
        <Mainbot selectedLanguage={selectedLanguage} />
      </div>
    </div> 
  );
}

export default App;
