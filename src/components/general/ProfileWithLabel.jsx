/**
 * A component that displays a profile image with a label.
 *
 * @component
 * @param {string} src - The source URL of the profile image.
 * @param {string} alt - The alternative text for the profile image.
 * @param {string} label - The label to be displayed below the profile image.
 * @returns {JSX.Element} The rendered ProfileWithLabel component.
 */
import React from "react";
import ProfileImage from "./ProfileImage";
function ProfileWithLabel({ src, alt, label }) {
    return (
      <div className='flex flex-col items-center'>
        <ProfileImage src={src} alt={alt} />
        <p className=''>{label}</p>
      </div>
    );
  }
  export default ProfileWithLabel;