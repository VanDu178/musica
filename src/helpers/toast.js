// import { toast } from "react-toastify";

// const showToast = (message, type = "success") => {
//   switch (type) {
//     case "success":
//       toast.success(message, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       break;
//     case "error":
//       toast.error(message, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       break;
//     case "info":
//       toast.info(message, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       break;
//     case "warning":
//       toast.warning(message, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       break;
//     default:
//       toast(message, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       break;
//   }
// };

// export default showToast;

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
};

export const handleError = (error, customMessage = null) => {
  if (customMessage) {
    Toast.error(customMessage);
    return;
  }

  if (typeof error === "string") {
    Toast.error(error);
    return;
  }

  if (error.response && error.response.status) {
    const statusCode = error.response.status;
    Toast.error(`Error ${statusCode}: ${error.message || "Unknown error"}`);
  } else {
    Toast.error(error.message || "An unknown error occurred");
  }
};

export const handleSuccess = (message) => {
  Toast.success(message);
};
