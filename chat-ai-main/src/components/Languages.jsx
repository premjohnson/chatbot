import React, { useState } from "react";
import { FaBars } from "react-icons/fa";

function Languages({ onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  // List of languages spoken in India
  const languages = [
    'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati',
    'Malayalam', 'Kannada', 'Odia', 'Punjabi', 'Assamese', 'Maithili', 'Santali',
    'Kashmiri', 'Nepali', 'Konkani'
  ];

  return (
    <div className="relative h-full">
      {/* Menu Icon */}
      <div
        className="cursor-pointer text-2xl text-gray-700 hover:text-gray-900"
        onClick={toggleMenu}
      >
        <FaBars />
      </div>

      {/* Languages Menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full md:w-56 bg-white shadow-lg rounded-lg p-4 z-10">
          {languages.map((language) => (
            <p
              key={language}
              className="text-gray-800 hover:text-yellow-600 cursor-pointer mb-2"
              onClick={() => handleLanguageSelect(`Translate this information to  ${language}...`)}
            >
              {language}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Languages;
