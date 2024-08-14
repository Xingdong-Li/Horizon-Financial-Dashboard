

import React, { useState } from 'react';

/**
 * Accordion component that displays a collapsible section with a title and content.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the accordion.
 * @param {ReactNode} props.children - The content of the accordion.
 * @returns {JSX.Element} The Accordion component.
 */
const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggles the accordion open or closed.
   */
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-center items-center p-4 focus:outline-none bg-gradient-to-l from-[#ffffff] via-[#ececed] to-[#ffffff] opacity-90"
        onClick={toggleAccordion}
      >
        <span className="text-xl font-semibold  text-co-gray ">{title}</span>
        <svg
          className={`w-6 h-6 transform transition-transform ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;