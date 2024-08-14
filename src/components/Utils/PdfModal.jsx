import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the app element for accessibility

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: "40", // Ensure the overlay is below the content but above other elements
  },
};
const PdfModal = ({ isOpen, onRequestClose, pdfUrl }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="PDF Modal"
    >
      <div className="flex justify-end">
        <button onClick={onRequestClose} className="text-xl">
          &times;
        </button>
      </div>
      <iframe
        src={pdfUrl}
        title="PDF Document"
        className="w-full h-full"
        style={{ height: "80vh" }}
      />
    </Modal>
  );
};

export default PdfModal;
