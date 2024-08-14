/**
 * Toast component displays a message with a specific type.
 *
 * @param {Object} props - The props object.
 * @param {string} props.message - The message to be displayed.
 * @param {string} props.type - The type of the toast (error, success, info).
 * @returns {JSX.Element} The rendered Toast component.
 */
const Toast = ({ message, type }) => {
  const backgroundColors = {
    error: "bg-red-500",
    success: "bg-green-500",
    info: "bg-blue-500",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`p-1 mb-2 rounded font-semibold w-4/5 shadow-lg text-white ${
          backgroundColors[type] || "bg-gray-500"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;
