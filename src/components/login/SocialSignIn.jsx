/**
 * Renders the social sign-in component.
 *
 * @returns {JSX.Element} The rendered social sign-in component.
 */
function SocialSignIn() {
  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {}} // Ensure you define this function to handle the sign-in process
          className="flex gap-2 items-center justify-center bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline w-3/4"
        >
          <img src="/google.png" alt="Google Logo" className="w-6 h-6" />
          Sign in with Google
        </button>

        <button
          type="button"
          onClick={() => {}} // Ensure you define this function to handle the sign-in process
          className=" bg-pink-400 hover:bg-pink-500 py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline"
        >
          <img src="/X.png" alt="Google Logo" className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}

export default SocialSignIn;
