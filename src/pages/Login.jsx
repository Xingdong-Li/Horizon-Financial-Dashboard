import { useEffect, useState } from "react";
import Branding from "../components/login/Branding";
import { PopupButton } from "@typeform/embed-react";
// import { useNavigate } from "react-router-dom";
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  confirmSignIn,
  resendSignUpCode,
  fetchMFAPreference,
  setUpTOTP,
  verifyTOTPSetup,
  updateMFAPreference,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";
import Toast from "../components/general/Toast";
import PasswordValidityPrompt from "../components/login/PasswordValidityPrompt";
import TermPrivacy from "../components/login/TermPrivacy";
import PopupModal from "../components/Utils/PopupModal";
import TOTPSetupOrInput from "../components/login/TOTPSetupOrInput";
import useAuth from "../hooks/useAuth";

/**
 * Login component.
 *
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The rendered Login component.
 */
function Login() {
  // This state would handle the form data and validations in a real-world scenario.
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    comfirmPassword: "",
    termsAccepted: false,
    confirmationCode: "",
    totpCode: "",
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [forLogin, setForLogin] = useState(true); // This would be used to toggle between the login and signup forms
  const [signedIn, setSignedIn] = useState(false); // This would be used to redirect the user to the dashboard after successful login
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [passwordShown, setPasswordShown] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [totpStepIdentifier, setTotpStepIdentifier] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [resetPasswordIdentifier, setResetPasswordIdentifier] = useState("");

  const [validity, setValidity] = useState({
    len: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  });

  const { attributes, loading } = useAuth();
  useEffect(() => {
    if (attributes) {
      setSignedIn(true);
      setFormData({ ...formData, email: attributes.email });
    }
  }, [loading]);

  useEffect(() => {
    if (forLogin && !resetPasswordIdentifier) return;
    const password = formData.password;
    setValidity({
      len: password.length >= 10 && password.length <= 20,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      match: password !== "" && password === formData.comfirmPassword,
    });
  }, [forLogin, formData.password, formData.comfirmPassword]);

  function toggleForm() {
    setForLogin(!forLogin);
    clearToast();
    setTotpStepIdentifier("");
  }

  function clearToast() {
    setToast({ msg: "", type: "" });
  }

  function handleClearEverything() {
    setFormData({
      ...formData,
      password: "",
      comfirmPassword: "",
      termsAccepted: false,
      confirmationCode: "",
      totpCode: "",
    });
    setValidity({
      len: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
      match: false,
    });
    setTotpStepIdentifier("");
    setFailedAttempts(0);
    setResetPasswordIdentifier("");
    clearToast();
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (name !== "confirmationCode") {
      setIsConfirming(false); // Reset confirmation state if the user changes the form data
    }
  };

  // This function will be called when the user submits the form
  // 1. User attempts to sign in (with or without TOTP)
  // 2. User attempts to sign in with TOTP
  // 3. User attempts to sign up
  // 4. User attempts to confirm sign up
  // 5. User attempts to configure TOTP

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (forLogin) {
      // Once the user enters the passcode, handle confirm sign in
      if (totpStepIdentifier == "Passcode" && formData.totpCode) {
        // This is for users who configured their TOTP app
        if (signedIn) {
          handleTOTPVerification(formData.totpCode);
        } else {
          handleConfirmSignIn();
        }
      }
      // Switch to the next step if the user has configured their TOTP app
      else if (totpStepIdentifier) {
        setTotpStepIdentifier("Passcode");
        setToast({
          msg: "Please enter the passcode from authenticator app",
          type: "info",
        });
      }
      // User just entered their email and password, trying to sign in
      else {
        handleSignInFirstAttempt({
          username: formData.email,
          password: formData.password,
        });
      }
    } else {
      // Handle signup
      if (!checkValidity()) return;
      if (isConfirming) {
        await handleConfirmSignUp(formData.email, formData.confirmationCode);
      } else {
        await handleSignUp({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }
    }
  };

  async function handleSignInFirstAttempt({ username, password }) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      console.log("isSignedIn", isSignedIn);
      console.log("nextStep", nextStep);
      if (isSignedIn) {
        setSignedIn(true);
        const mfaPreference = await fetchMFAPreference();
        // console.log("mfaPreference", mfaPreference);
        // console.log(mfaPreference.enabled);
        handleClearEverything();
        if (!mfaPreference.enabled?.includes("TOTP")) {
          setPopupOpen(true);
        }
        return;
      }
      switch (nextStep.signInStep) {
        // First time users will be prompted to setup TOTP unless MFA is optional
        case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP": {
          const totpSetupDetails = nextStep.totpSetupDetails;
          const appName = "Horizon";
          const setupUri = totpSetupDetails.getSetupUri(appName, appName);
          setTotpStepIdentifier(setupUri.href);
          setToast({
            msg: "2FA required. Please configure your TOTP app",
            type: "info",
          });
          break;
        }
        // Returning users will be prompted to enter their TOTP passcode if MFA is enabled
        case "CONFIRM_SIGN_IN_WITH_TOTP_CODE": {
          setTotpStepIdentifier("Passcode");
          setToast({
            msg: "Enter the passcode from your authenticator app",
            type: "info",
          });
          break;
        }
      }
    } catch (error) {
      console.log("error signing in", error);
      setToast({ msg: error.message, type: "error" });
    }
  }

  function handleTOTPErrorToast(error) {
    if (error.name === "NotAuthorizedException") {
      setToast({
        msg: "Session expired. Please sign in again.",
        type: "error",
      });
      setTotpStepIdentifier("");
      setFormData({ ...formData, totpCode: "" });
    } else if (
      error.name === "InvalidParameterException" ||
      error.message === "Code mismatch"
    ) {
      setToast({ msg: "Invalid code. Please try again.", type: "error" });
    } else {
      setToast({ msg: error.message, type: "error" });
    }
  }

  async function handleConfirmSignIn() {
    confirmSignIn({ challengeResponse: formData.totpCode })
      .then(async () => {
        setSignedIn(true);
        handleClearEverything();
        window.location.replace("/");
      })
      .catch((error) => {
        console.log("error confirming sign in:", error);
        handleTOTPErrorToast(error);
      });
  }

  function checkValidity() {
    if (!validity.len) {
      setToast({
        msg: "Password must be 10-20 characters long.",
        type: "error",
      });
      return false;
    } else if (!validity.uppercase) {
      setToast({
        msg: "Password must contain at least 1 uppercase letter.",
        type: "error",
      });
      return false;
    } else if (!validity.lowercase) {
      setToast({
        msg: "Password must contain at least 1 lowercase letter.",
        type: "error",
      });
      return false;
    } else if (!validity.number) {
      setToast({
        msg: "Password must contain at least 1 number.",
        type: "error",
      });
      return false;
    } else if (!validity.special) {
      setToast({
        msg: "Password must contain at least 1 special character.",
        type: "error",
      });
      return false;
    } else if (!validity.match) {
      setToast({
        msg: "Passwords must match.",
        type: "error",
      });
      return false;
    }
    return true;
  }

  async function handleSignOut() {
    try {
      signOut().then(() => {
        setSignedIn(false);
        handleClearEverything();
        setToast({ msg: "You have been signed out.", type: "success" });
      });
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  async function handleSignUp({ username, email, password }) {
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email: email,
            name: username,
          },
        },
      });
      switch (nextStep.signUpStep) {
        case "CONFIRM_SIGN_UP":
          setIsConfirming(true);
          setToast({
            msg: "Enter the confirmation code sent to your email.",
            type: "info",
          });
          restrictResendCode();
          return;
        case "COMPLETE_AUTO_SIGN_IN":
          break;
        case "DONE":
          toggleForm();
          return;
      }
    } catch (error) {
      if (error.name === "UsernameExistsException") {
        // Optional: check if the user is unconfirmed before deciding to resend the code
        handleResendCode(email);
      } else {
        console.error("error signing up:", error);
        setToast({
          msg: error?.response?.data?.message || error.message,
          type: "error",
        });
      }
    }
  }

  function restrictResendCode() {
    setButtonDisabled(true);
    let counter = 59;
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown(counter);
      if (counter <= 0) {
        clearInterval(interval);
        setButtonDisabled(false); // Re-enable the button after 60 seconds
        setCountdown(60); // Reset the countdown (optional)
      } else {
        counter -= 1;
      }
    }, 1000);
  }

  const handleResendCode = async (email) => {
    if (buttonDisabled) return;
    // Initially disable the button and start the countdown
    restrictResendCode();
    try {
      await resendSignUpCode({ username: email });
      setToast({
        msg: "Confirmation code resent. Please check your email.",
        type: "info",
      });
      setIsConfirming(true); // Move to confirmation step
    } catch (error) {
      console.error("error resending confirmation code:", error);
      if (error.message === "User is already confirmed.") {
        setToast({
          msg: "User is already existed. Please sign in.",
          type: "error",
        });
      } else {
        setToast({ msg: error.message, type: "error" });
      }
    }
  };

  async function handleConfirmSignUp(email, confirmationCode) {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: confirmationCode,
      });
      setIsConfirming(false); // Reset or redirect user to the next step
      handleClearEverything();
      toggleForm();
      setToast({ msg: "Account confirmed. Please sign in.", type: "success" });
    } catch (error) {
      console.log("error confirming sign up:", error);
      setToast({ msg: error.message, type: "error" });
    }
  }

  async function handleTOTPSetup(message = "Please configure your TOTP app") {
    try {
      const totpSetupDetails = await setUpTOTP();
      const appName = "Care-Wallet";
      const setupUri = totpSetupDetails.getSetupUri(appName, appName);
      setTotpStepIdentifier(setupUri.href);
      setToast({
        msg: message,
        type: "info",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleTOTPVerification(totpCode) {
    verifyTOTPSetup({ code: totpCode })
      .then(() => {
        setToast({ msg: "TOTP setup successful", type: "success" });
        setTotpStepIdentifier("");
        updateMFAPreference({ totp: "ENABLED" });
      })
      .catch((error) => {
        console.log("error verifying TOTP setup:", error);
        setFailedAttempts(failedAttempts + 1);
        if (failedAttempts >= 2) {
          handleTOTPSetup(
            "You have exceeded the number of attempts. Please configure your TOTP app again."
          );
          setFailedAttempts(0);
          setFormData({ ...formData, totpCode: "" });
        } else handleTOTPErrorToast(error);
      });
  }

  // This function will be called when the user requests to reset their password
  async function handleResetPassword(e) {
    e.preventDefault();
    if (resetPasswordIdentifier === "open") {
      resetPassword({ username: formData.email })
        .then((output) => handleResetPasswordNextSteps(output))
        .catch((error) => {
          console.log(error);
          setToast({ msg: error.message, type: "error" });
        });
    } else if (resetPasswordIdentifier === "passcode") {
      setResetPasswordIdentifier("passwords");
      setPasswordShown(false);
      setToast({ msg: "Please enter the new password", type: "info" });
    } else if (resetPasswordIdentifier === "passwords") {
      confirmResetPassword({
        username: formData.email,
        confirmationCode: formData.confirmationCode,
        newPassword: formData.password,
      })
        .then(() => {
          setResetPasswordIdentifier("");
          setToast({ msg: "Password reset successful", type: "success" });
          setFormData({
            ...formData,
            email: "",
            password: "",
            comfirmPassword: "",
            termsAccepted: false,
            confirmationCode: "",
            totpCode: "",
          });
        })
        .catch((error) => {
          console.log(error);
          setToast({ msg: error.message, type: "error" });
        });
    }
  }

  function handleResetPasswordNextSteps(output) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case "CONFIRM_RESET_PASSWORD_WITH_CODE": {
        setResetPasswordIdentifier("passcode");
        setToast({
          msg: `Confirmation code was sent to ${formData.email}`,
          type: "info",
        });
        // Collect the confirmation code from the user and pass to confirmResetPassword.
        break;
      }
      case "DONE":
        console.log("Successfully reset password.");
        break;
    }
  }

  // components below

  function FormToggleButton() {
    return (
      <p className="flex flex-col lg:flex-row text-black font-serif text-lg py-2 px-4">
        {forLogin ? "Not" : "Already"} a member? &nbsp;
        <button className="text-blue-600" onClick={() => toggleForm()}>
          Sign {forLogin ? "up" : "in"} now
        </button>
      </p>
    );
  }

  function UserInfo() {
    return (
      <div className="flex flex-col items-center justify-center">
        <PopupModal
          isOpen={popupOpen}
          setIsOpen={setPopupOpen}
          title="MFA setup recommended"
          content="For added security, we recommend setting up multi-factor authentication (MFA) using an authenticator app.\nWould you like to set it up now?"
          proceedText="Yes"
          onProceed={handleTOTPSetup}
          onDecline={() => window.location.replace("/")}
          declineText="Not now"
        />
        <p className="text-2xl font-semibold mb-4 text-left">
          Welcome, {formData.email}
        </p>
        <form
          onSubmit={handleSubmit}
          className="relative px-8 max-w-xl w-full mb-3"
        >
          <TOTPSetupOrInput
            formData={formData}
            handleInputChange={handleInputChange}
            totpStepIdentifier={totpStepIdentifier}
          />
          <div className="flex items-center justify-center mt-2">
            {toast.msg && <Toast message={toast.msg} type={toast.type} />}
          </div>

          <div className="w-full flex items-center justify-between mt-2">
            {totpStepIdentifier ? (
              <button
                className="bg-logo-blue hover:bg-[#00CD] text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {totpStepIdentifier === "Passcode"
                  ? "Confirm"
                  : "I have configured my TOTP app"}
              </button>
            ) : (
              <button
                type="button"
                className="bg-logo-blue hover:bg-[#00CD] text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                onClick={() => window.location.replace("/")}
              >
                Visit Dashboard
              </button>
            )}

            <button
              type="button"
              className="bg-logo-blue hover:bg-[#00CD] text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              onClick={() => handleSignOut()}
            >
              Log Out
            </button>
          </div>
        </form>
      </div>
    );
  }

  function PasswordSection() {
    return (
      <>
        <label
          className="block text-gray-700 font-bold text-left"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          name="password"
          value={formData.password}
          type={passwordShown ? "text" : "password"}
          required
          placeholder="******************"
          onChange={handleInputChange}
        />

        {(!forLogin || resetPasswordIdentifier) && (
          <>
            <label
              className="block text-gray-700 font-bold text-left"
              htmlFor="comfirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="comfirmPassword"
              name="comfirmPassword"
              value={formData.comfirmPassword}
              type={passwordShown ? "text" : "password"}
              required
              placeholder="******************"
              onChange={handleInputChange}
            />
          </>
        )}
        <div
          className={`flex justify-${
            forLogin && !resetPasswordIdentifier ? "between" : "end"
          }`}
        >
          {forLogin && !resetPasswordIdentifier && (
            <button
              type="button"
              className="inline-block align-baseline font-bold text-sm text-logo-blue hover:text-[#00CD] italic text-nowrap"
              onClick={() => setResetPasswordIdentifier("open")}
            >
              Forgot Password?
            </button>
          )}
          <button
            type="button"
            className="text-sm hover:text-gray-900"
            onClick={() => setPasswordShown(!passwordShown)}
          >
            {passwordShown ? "Hide" : "Show"} password
          </button>
        </div>
        {(!forLogin || resetPasswordIdentifier) && (
          <PasswordValidityPrompt validity={validity} />
        )}
      </>
    );
  }

  function BeforeLoginContent() {
    return (
      <>
        <div className="relative px-8 max-w-xl w-full">
          <p className="text-2xl font-semibold mb-4 text-left">
            Sign {forLogin ? "In" : "Up"} to Horizon
          </p>
          <div className="flex-grow border-t border-gray-300 my-4"></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative px-8 max-w-xl w-full md:w-4/5"
        >
          <div className="mb-4 flex flex-col gap-2">
            {!forLogin && (
              <>
                <label
                  className="block text-gray-700 font-bold text-left"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  name="username"
                  value={formData.username}
                  type="text"
                  placeholder="Enter your username"
                  required
                  onChange={handleInputChange}
                />
              </>
            )}
            <label
              className="block text-gray-700 font-bold text-left"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              value={formData.email}
              type="email"
              required
              placeholder="Email"
              onChange={handleInputChange}
            />

            {PasswordSection()}

            {isConfirming && (
              <>
                <label
                  className="block text-gray-700 font-bold text-left"
                  htmlFor="confirmationCode"
                >
                  Confirmation Code
                </label>
                <input
                  type="text"
                  name="confirmationCode"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Confirmation Code"
                  onChange={handleInputChange}
                  required
                />
              </>
            )}

            <TermPrivacy
              handleInputChange={handleInputChange}
              forLogin={forLogin}
            />
            {toast.msg && <Toast message={toast.msg} type={toast.type} />}

            <TOTPSetupOrInput
              formData={formData}
              handleInputChange={handleInputChange}
              totpStepIdentifier={totpStepIdentifier}
            />
          </div>
          {/* Buttons below */}
          <div
            className={`w-full flex items-center justify-${
              forLogin || isConfirming ? "between" : "center"
            }`}
          >
            <button
              className="w-full bg-logo-blue hover:bg-[#00CD] text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {(isConfirming || totpStepIdentifier === "Passcode"
                ? "Confirm"
                : "") +
                " Sign " +
                (forLogin ? "In" : "Up")}
            </button>
            {isConfirming && (
              <button
                type="button"
                className={`inline-block align-baseline font-bold text-sm  ${
                  buttonDisabled
                    ? "text-blue-500"
                    : "text-logo-blue hover:text-[#00CD]"
                } italic`}
                onClick={() => handleResendCode(formData.email)}
              >
                {buttonDisabled ? `Resend Code (${countdown}s)` : "Resend Code"}
              </button>
            )}
          </div>
        </form>
      </>
    );
  }

  function PasswordResetSection() {
    return (
      <>
        <p className="text-2xl font-semibold mb-4">Reset Password</p>
        <form
          onSubmit={handleResetPassword}
          className="relative px-8 max-w-xl w-full md:w-4/5"
        >
          <div className="mb-4 flex flex-col gap-2">
            <label
              className="block text-gray-700 font-bold text-left"
              htmlFor="email"
            >
              Enter your email address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              value={formData.email}
              type="email"
              required
              placeholder="Email"
              onChange={handleInputChange}
            />
            {(resetPasswordIdentifier === "passcode" ||
              resetPasswordIdentifier === "passwords") && (
              <>
                <label
                  className="block text-gray-700 font-bold text-left"
                  htmlFor="confirmationCode"
                >
                  Confirmation Code
                </label>
                <input
                  type="text"
                  name="confirmationCode"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Confirmation Code"
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
            {resetPasswordIdentifier === "passwords" && PasswordSection()}
            {toast.msg && <Toast message={toast.msg} type={toast.type} />}
            <div className="w-full flex items-center">
              <button
                className="w-full bg-logo-blue hover:bg-[#00CD] text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {resetPasswordIdentifier === "passcode"
                  ? "Confirm"
                  : resetPasswordIdentifier === "passwords"
                  ? "Reset Password"
                  : "Send verification code"}
              </button>
              <button
                type="button"
                className="inline-block align-baseline font-bold text-sm text-logo-blue hover:text-[#00CD] italic ml-2"
                onClick={() => {
                  setResetPasswordIdentifier("");
                  clearToast();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch min-h-screen w-full bg-gray-100">
      <div className="relative w-full md:w-2/5 flex items-center justify-center py-4 min-h-screen">
        <div className="absolute top-0 right-0 p-2">
          {!signedIn && !resetPasswordIdentifier && FormToggleButton()}
        </div>
        <div className="md:w-full max-w-[600px] relative z-10 flex flex-col items-center justify-center p-3 rounded-3xl bg-white bg-opacity-10 hover:bg-opacity-90 my-10 transition duration-500 ease-in-out hover:border-2 hover:border-blue-300 border border-transparent">
          {signedIn
            ? UserInfo()
            : resetPasswordIdentifier
            ? PasswordResetSection()
            : BeforeLoginContent()}
        </div>
        <div className="absolute bottom-2">
          <a href="/#">About Horizon</a>
          <br />© 2023-2024 Horizon, Inc. All rights reserved.
        </div>
      </div>
      <div className="relative w-full hidden md:w-3/5 md:flex flex-col items-center justify-center p-4">
        <Branding />
      </div>
    </div>
  );
}

export default Login;
