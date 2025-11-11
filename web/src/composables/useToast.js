import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export function useToast() {
  const success = (message, options = {}) => {
    toast.success(message, {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const error = (message, options = {}) => {
    toast.error(message, {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const warning = (message, options = {}) => {
    toast.warning(message, {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const info = (message, options = {}) => {
    toast.info(message, {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const loading = (message, options = {}) => {
    toast.loading(message, {
      autoClose: false,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const update = (toastId, message, options = {}) => {
    toast.update(toastId, {
      render: message,
      ...options
    });
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    update,
    dismiss,
    dismissAll,
    toast // expose the raw toast function for advanced usage
  };
}
