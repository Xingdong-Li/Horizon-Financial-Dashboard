/**
 * Renders the branding section of the login page.
 *
 * @returns {JSX.Element} The rendered branding section.
 */
function Branding() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#77a2f2] to-[#6897f0] opacity-90"></div>
      <div className="flex flex-col items-center max-w-md mx-auto text-center z-10">
        <div className="flex items-center justify-center gap-2">
          <img src="/icons/logo.svg" alt="Care Icon" />
          <h1 className="2xl:text-26 font-ibm-plex-serif text-[26px] font-semibold text-black-1 max-xl:hidden">Horizon</h1>
        </div>
        <p className="text-2xl md:text-nowrap lg:text-2xl xl:text-2xl font-semibold text-gray-700 mb-4">
          Your trustworthy financial partner
        </p>
        <p className="font-serif text-md md:text-2xl text-gray-700 mb-6">
          A platform that helps you manage your finances and investments
        </p>
      </div>

      <img
        src="/icons/auth-image.svg"
        alt="Care Icon"
        className="mb-4 object-cover opacity-75"
        // style={{ filter: "blur(0.5px)" }}
      />
    </>
  );
}

export default Branding;
