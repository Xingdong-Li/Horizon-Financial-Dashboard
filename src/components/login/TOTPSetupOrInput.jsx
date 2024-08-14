import QRCode from "react-qr-code";
/**
 * Renders the TOTP setup or input component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.formData - The form data.
 * @param {Function} props.handleInputChange - The function to handle input change.
 * @param {string} props.totpStepIdentifier - The TOTP step identifier.
 * @returns {JSX.Element|null} The TOTP setup or input component.
 */
function TOTPSetupOrInput({ formData, handleInputChange, totpStepIdentifier }) {
  if (!totpStepIdentifier) return null;
  return totpStepIdentifier === "Passcode" ? (
    <>
      <label className="block text-gray-700 font-bold" htmlFor="totpCode">
        Passcode in authenticator app
      </label>
      <input
        type="text"
        id="totpCode"
        name="totpCode"
        value={formData.totpCode}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
        placeholder="Passcode in authenticator app"
        onChange={handleInputChange}
        required
      />
    </>
  ) : (
    <div className="flex flex-col items-center">
      <div className="mb-1">
        <span className="font-semibold text-xl">
          Scan this QR code with your authenticator app
        </span>
        <br />
        <span className="text-sm italic">
          (e.g. Microsoft Authenticator, Google Authenticator, Duo)
        </span>
        <br />
        <span className="italic font-semibold">
          If your authenticator app is already configured with an account,
          please delete the existing account from your authenticator app before
          scanning the QR code.
        </span>
      </div>
      <QRCode value={totpStepIdentifier} id="qrCodeImage" size={192} />
    </div>
  );
}

export default TOTPSetupOrInput;
