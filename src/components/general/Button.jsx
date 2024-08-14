/**
 * Button component.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content of the button.
 * @param {function} props.onClick - The click event handler for the button.
 * @param {string} props.className - The additional CSS class name for the button.
 * @param {boolean} props.disabled - Whether the button is disabled or not.
 * @returns {JSX.Element} The rendered button component.
 */
export default function Button({ children, onClick, className, disabled }) {
  return (
    <button
      className={`bg-logo-blue hover:bg-co-care-plan-7-hover text-white text-lg font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
