
import React, { createContext, useContext, useState } from 'react';

/**
 * Context for managing user authentication state.
 * @typedef {Object} UserContextType
 * @property {Object} user - The current user object.
 * @property {Function} setUser - Function to update the user object.
 */

const UserContext = createContext();

/**
 * Custom hook to access the user context.
 * @returns {UserContextType} The user context object.
 */
export function useUser() {
  return useContext(UserContext);
}

/**
 * Provider component for the user context.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The user provider component.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
