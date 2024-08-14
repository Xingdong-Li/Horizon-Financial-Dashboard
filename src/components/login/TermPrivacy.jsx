/**
 * Renders the TermPrivacy component.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.handleInputChange - The function to handle input change.
 * @param {boolean} props.forLogin - Indicates whether the component is used for login.
 * @returns {JSX.Element} The rendered TermPrivacy component.
 */
function TermPrivacy({ handleInputChange, forLogin }) {
  return (
    <div className="my-1 flex w-full items-center justify-center">
      <input
        className="mr-2 leading-tight"
        id="termsAccepted"
        name="termsAccepted"
        type="checkbox"
        onChange={handleInputChange}
        required
      />
      <label className="text-sm text-gray-600" htmlFor="termsAccepted" required>
        By clicking the Sign {forLogin ? "In" : "Up"} button, I agree to
        the&nbsp;<span className="text-nowrap">Horizon</span>&apos;s
        <br />
        <a
          href="/#"
          className="text-blue-500"
        >
          Terms of Use
        </a>
        &nbsp; &amp; &nbsp;
        <a
          href="#"
          className="text-blue-500"
        >
          Privacy Policy
        </a>
        .
      </label>
    </div>
  );
}

export default TermPrivacy;
