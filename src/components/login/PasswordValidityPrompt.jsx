/**
 * Renders a password validity prompt with rules and validation status.
 *
 * @component
 * @param {Object} validity - The password validity object.
 * @param {boolean} validity.len - Indicates if the password length is valid.
 * @param {boolean} validity.uppercase - Indicates if the password contains at least one uppercase letter.
 * @param {boolean} validity.lowercase - Indicates if the password contains at least one lowercase letter.
 * @param {boolean} validity.number - Indicates if the password contains at least one number.
 * @param {boolean} validity.special - Indicates if the password contains at least one special character.
 * @param {boolean} validity.match - Indicates if the passwords match.
 * @returns {JSX.Element} The rendered PasswordValidityPrompt component.
 */
function PasswordValidityPrompt({ validity }) {
  return (
    <>
      <p className="italic underline">
        <span className="text-gray-600">Password Rules:</span>
        <br></br>
        <span className={`${validity.len ? "text-green-500" : "text-red-500"}`}>
          Must be 10-20 characters long.
        </span>
        <br></br>
        <span
          className={`text-${validity.uppercase ? "green-500" : "red-500"}`}
        >
          At least 1 uppercase letter
        </span>
        <br></br>
        <span
          className={`text-${validity.lowercase ? "green-500" : "red-500"}`}
        >
          At least 1 lowercase letter
        </span>
        <br></br>
        <span className={`text-${validity.number ? "green-500" : "red-500"}`}>
          At least 1 number
        </span>
        <br></br>
        <span className={`text-${validity.special ? "green-500" : "red-500"}`}>
          At least 1 special character
        </span>
        <br></br>
        <span className={`text-${validity.match ? "green-500" : "red-500"}`}>
          Passwords must match
        </span>
      </p>
    </>
  );
}

export default PasswordValidityPrompt;
