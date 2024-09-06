import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FaArrowDown, FaSpinner, FaTrash, FaMicrophone } from "react-icons/fa";

function Mainbot({ selectedLanguage }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [useContext, setUseContext] = useState(true); 

  useEffect(() => {
    setQuestion(` ${selectedLanguage}...`);
  }, [selectedLanguage]);

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("Loading your answer... \n It might take up to 10 seconds");

    try {
      let context = "";

      if (useContext && conversation.length > 0) {
        context =
          conversation
            .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
            .join("\n") + `\nQ: ${question}`;
      } else {
        context = `Q: ${question}`;
      }

      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA-NLpTAWLnnMGI8TEfd6D7PUAMixojYtk",
        method: "post",
        data: {
          contents: [{ parts: [{ text: context }] }],
        },
      });

      const generatedAnswer =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];

      // Translate the generated answer to the selected language
      const translatedAnswer = await translateText(generatedAnswer, selectedLanguage);
      
      setAnswer(translatedAnswer);

      setConversation([...conversation, { question, answer: translatedAnswer }]);

      setQuestion("");
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  const translateText = async (text, targetLanguage) => {
    try {
      const response = await axios.post(
        "https://translation.googleapis.com/language/translate/v2",
        null,
        {
          params: {
            q: text,
            target: getLanguageCode(targetLanguage),
            key: "AIzaSyB5ICUUj8HaaurEnmyIzpbVyz10BkWcXj4",
          },
        }
      );
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return the original text in case of an error
    }
  };

  const getLanguageCode = (language) => {
    const languageMap = {
      English: "en",
      Hindi: "hi",
      Telugu: "te",
      Malayalam: "ml",
      Bengali: "bn",
      Marathi: "mr",
      Gujarati: "gu",
      Kannada: "kn",
      Oriya: "or",
      Punjabi: "pa",
      Assamese: "as",
      Nepali: "ne",
      Konkani: "kok",
    };
    return languageMap[language] || "en"; // Default to English if the language isn't found
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateAnswer(e);
    }
  };

  const handleVoiceInput = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      const languageMap = {
        English: "en-US",
        Hindi: "hi-IN",
        Telugu: "te-IN",
        Malayalam: "ml-IN",
        Bengali: "bn-IN",
        Marathi: "mr-IN",
        Urdu: "ur-IN",
        Gujarati: "gu-IN",
        Kannada: "kn-IN",
        Odia: "or-IN",
        Punjabi: "pa-IN",
        Assamese: "as-IN",
        Maithili: "mai-IN",
        Santali: "sat-IN",
        Kashmiri: "ks-IN",
        Nepali: "ne-IN",
        Konkani: "kok-IN"
    };
    

      recognition.lang = languageMap[selectedLanguage] || "en-US";

      recognition.onresult = function (event) {
        const voiceText = event.results[0][0].transcript;
        setQuestion(voiceText);
      };

      recognition.start();
    } else {
      alert("Voice recognition not supported in this browser.");
    }
  };

  const clearChat = () => {
    setConversation([]);
  };

  return (
    <div className="bg-gray-400 h-full p-3 flex flex-col">
      <div className="flex-1 overflow-auto mb-4">
        {conversation.map((item, index) => (
          <div
            key={index}
            className="my-2 p-4 bg-gray-300 rounded-lg shadow-md transition-all duration-500"
          >
            <p className="text-gray-600 font-semibold">Q: {item.question}</p>
            <ReactMarkdown className="mt-2">{item.answer}</ReactMarkdown>
          </div>
        ))}
        {generatingAnswer && (
          <div className="flex justify-center items-center py-4">
            <FaSpinner className="animate-spin text-4xl text-gray-600" />
          </div>
        )}
      </div>

      <form
        onSubmit={generateAnswer}
        className="flex-shrink-0 flex flex-col sm:flex-row items-center"
      >
        <textarea
          required
          className="bg-white rounded w-full my-2 p-3 transition-all duration-300 focus:bg-white focus:shadow-lg focus:outline-none"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedLanguage}
        ></textarea>
        <div className="flex items-center mt-2 sm:mt-0 sm:ml-2">
          <button
            type="submit"
            className="flex items-center justify-center p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
            disabled={generatingAnswer}
          >
            <FaArrowDown />
          </button>
          <button
            type="button"
            className="flex items-center justify-center p-2 rounded-full bg-yellow-500 text-white hover:bg-red-600 transition-all duration-300 ml-2"
            onClick={clearChat}
          >
            <FaTrash />
          </button>
          <button
            type="button"
            className="flex items-center justify-center p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 ml-2"
            onClick={handleVoiceInput}
          >
            <FaMicrophone />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Mainbot;
