import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Modal({ onClose, onConfirm, message }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Dimmed background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-white/30 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isClosing ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md z-10"
        >
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            {message}
          </h2>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-full bg-black text-white hover:bg-gray-900 transition-all"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}













// import { motion } from "framer-motion";

// export default function Modal({ onClose, onConfirm, message }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop Blur */}
//       <div
//         className="absolute inset-0 backdrop-blur-sm bg-white/30"
//         onClick={onClose}
//       />

//       {/* Modal content with animation */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.9 }}
//         transition={{ duration: 0.3, ease: "easeOut" }}
//         className="relative bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full z-10"
//       >
//         <p className="text-gray-800 text-lg mb-6 text-center">{message}</p>
//         <div className="flex justify-center space-x-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
//           >
//             Confirm
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
