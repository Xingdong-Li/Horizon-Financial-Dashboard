import React, { useState } from 'react';

/**
 * SpeedDial component.
 * 
 * @returns {JSX.Element} The rendered SpeedDial component.
 */
function SpeedDial() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{zIndex:1}} className="fixed bottom-3 right-3 group"  onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}>
      <div 
        id="speed-dial-menu-dropdown" 
        className={`flex flex-col justify-end py-1 mb-4 space-y-2 bg-white border border-gray-100 rounded-lg shadow-sm  transition-all duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'}`}
      >
        <ul className="text-xl">
          <li>
            <a href="#" className="flex text-lg text-gray-700 items-center px-5 py-2 hover:bg-co-dark-green  hover:text-white">
              <span className="font-semibold ">Upload file</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-5 py-2 text-lg text-gray-700 hover:bg-co-dark-green  hover:text-white ">
             
              <span className="font-semibold ">Chat</span>
            </a>
          </li>
        </ul>
      </div>
      <button 
        type="button" 
        className="flex items-center justify-center text-white bg-co-dark-green rounded-lg w-14 h-14 hover:bg-green-900 "
      >
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <span className="sr-only">Open actions menu</span>
      </button>
    </div>
  );
}

export default SpeedDial;
