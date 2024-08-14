import { Link } from "react-router-dom";

/**
 * @file NotFoundPage.jsx
 * @desc This file defines the 404 page.
 * @returns {JSX.Element} - The 404 page
 */
const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-6xl text-gray-800 font-bold mb-2">404</h1>
      <p className="text-xl text-gray-700 mb-4">Page Not Found</p>
      <p className="text-lg text-gray-600 mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
