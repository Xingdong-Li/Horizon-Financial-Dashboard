/**
 * Renders a profile image component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - The alternative text for the image.
 * @returns {JSX.Element} The profile image component.
 */
import React from "react";
function ProfileImage({ src, alt }) {
    return <img src={src} alt={alt} className="w-8 h-8 rounded-full" />;
  }

  export default ProfileImage;