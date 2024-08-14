import { useState, useEffect } from "react";
import {
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
  signOut,
} from "aws-amplify/auth";
/**
 * Custom hook to access the user context.
 * @property {string} userId - The user ID.
 * @property {string} userEmail - The user email.
 * @property {Object} tokens - The user tokens.
 * @property {Object} attributes - The user attributes.
 * @property {boolean} loading - The loading
 * @return {Object} The user context object, including user ID, email, tokens, attributes, and loading state.
 */
function useAuth() {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [tokens, setTokens] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    async function checkUser() {
      try {
        const attributes = await fetchUserAttributes();
        setAttributes(attributes);
        console.log("Attributes", attributes);
      } catch (error) {
        console.error("Error fetching user attributes", error);
        if (error.name === "UserNotFoundException") {
          signOut().then(() => {
            window.location.reload();
          });
        }
        setLoading(false);
        return;
      }
      const { username, userId, signInDetails } = await getCurrentUser();
      if (username) {
        console.log("User is signed in", username, userId, signInDetails);
        setUserId(userId);
        setUserEmail(signInDetails.loginId);
        const { tokens } = await fetchAuthSession();
        setTokens(tokens.idToken);
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  return { attributes, userId, userEmail, tokens, loading};
}

export default useAuth;
