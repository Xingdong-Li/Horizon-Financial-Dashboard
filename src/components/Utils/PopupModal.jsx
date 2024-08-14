import React from "react";
/**
 * Component for a popup modal.
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - The modal open state.
 * @param {Function} props.setIsOpen - The function to set the modal open state.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.content - The content of the modal.
 * @param {string} props.proceedText - The text for the proceed button.
 * @param {Function} props.onProceed - The function to call when the user proceeds.
 * @param {string} props.declineText - The text for the decline button.
 * @param {Function} props.onDecline - The function to call when the user declines.
 * @returns {JSX.Element} The PopupModal component.
 */
function PopupModal({
  isOpen,
  setIsOpen,
  title,
  content,
  proceedText,
  onProceed,
  declineText,
  onDecline,
}) {
  const handleAgree = () => {
    onProceed();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onDecline) {
      onDecline();
    }
  };

  if (!isOpen) {
    return null;
  }

  const text = content.split("\\n").map((str, index, array) => (
    <React.Fragment key={index}>
      {str}
      {index !== array.length - 1 && <br />}
    </React.Fragment>
  ));
  return (
    <div className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-center">{title}</h2>
        <p className="text-center">
          {text} &nbsp;
          <a
            href="https://aws.amazon.com/what-is/mfa/"
            className="text-blue-500 underline mt-2"
            target="_blank"
          >
            Learn more about MFA/2FA
          </a>
        </p>

        <div className="flex items-center mt-4 relative">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 absolute left-1/2 transform -translate-x-1/2"
            onClick={handleAgree}
          >
            {proceedText}
          </button>
          <div className="flex-grow"></div>
          <button
            className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
            onClick={handleClose}
          >
            {declineText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupModal;
