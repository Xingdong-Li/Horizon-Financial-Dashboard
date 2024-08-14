
/**
 * @file ComingsoonMessage.jsx is a component to show a message when a page is under construction.
 * @param {string} message - The message to display
 * @returns {JSX.Element} - The message component
 */

const ComingsoonMessage = ({message}) => {
    return (
        <div className="flex flex-col items-center justify-center my-12">
        <p className="text-xl font-bold text-co-gray">{message}</p>
        </div>
    );
    }
export default ComingsoonMessage;