import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FaArrowDown, FaSpinner, FaTrash } from "react-icons/fa"; // Import the trash icon for clear button

function Mainbot({ selectedLanguage }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [conversation, setConversation] = useState([]); // Array to store conversation history

  useEffect(() => {
    setQuestion(`${selectedLanguage}`);
  }, [selectedLanguage]);

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("Loading your answer... \n It might take up to 10 seconds");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA-NLpTAWLnnMGI8TEfd6D7PUAMixojYtk",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const generatedAnswer =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];

      setAnswer(generatedAnswer);

      // Add the new question and answer to the conversation history
      setConversation([...conversation, { question, answer: generatedAnswer }]);

      // Clear the input field after submitting the question
      setQuestion();
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default newline behavior
      generateAnswer(e); // Call the function to generate the answer
    }
  };

  // Clear the conversation history
  const clearChat = () => {
    setConversation([]);
  };

  return (
    <div className="bg-gray-400 h-full p-3 flex flex-col"> {/* Changed background to gray */}
      {/* Display conversation history */}
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
        {/* Loading Spinner */}
        {generatingAnswer && (
          <div className="flex justify-center items-center py-4">
            <FaSpinner className="animate-spin text-4xl text-gray-600" />
          </div>
        )}
      </div>

      {/* Input area, send arrow, and clear chat button */}
      <form
        onSubmit={generateAnswer}
        className="flex-shrink-0 flex flex-col sm:flex-row items-center"
      >
        <textarea
          required
          className="bg-white rounded w-full my-2 p-3 transition-all duration-300 focus:bg-white focus:shadow-lg focus:outline-none" // Removed border and set background color
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown} // Capture Enter key press
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
        </div>
      </form>
    </div>
  );
}

export default Mainbot;
