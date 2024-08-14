

/**
 * Renders a page title component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to be displayed.
 * @returns {JSX.Element} The rendered page title component.
 */
export default function PageTitle({ title }) {
    return (
        <h2 className="text-xl tracking-tight text-co-gray sm:text-3xl">
        {title}
        </h2>
    );
    }