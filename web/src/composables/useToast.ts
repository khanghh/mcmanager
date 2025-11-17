import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

type ToastOptions = Record<string, any>;
type ToastId = string | number;

export interface UseToast {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  loading: (message: string, options?: ToastOptions) => void;
  update: (toastId: ToastId, message: string, options?: ToastOptions) => void;
  dismiss: (toastId?: ToastId) => void;
  dismissAll: () => void;
  toast: any;
}

export function useToast(): UseToast {
  const _toast: any = toast as any;

  const success = (message: string, options: ToastOptions = {}) => {
    _toast.success(message, {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const error = (message: string, options: ToastOptions = {}) => {
    _toast.error(message, {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const warning = (message: string, options: ToastOptions = {}) => {
    _toast.warning(message, {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const info = (message: string, options: ToastOptions = {}) => {
    _toast.info(message, {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const loading = (message: string, options: ToastOptions = {}) => {
    _toast.loading(message, {
      autoClose: false,
      position: toast.POSITION.BOTTOM_RIGHT,
      ...options
    });
  };

  const update = (toastId: ToastId, message: string, options: ToastOptions = {}) => {
    _toast.update(toastId, {
      render: message,
      ...options
    });
  };

  const dismiss = (toastId?: ToastId) => {
    _toast.dismiss(toastId);
  };

  const dismissAll = () => {
    _toast.dismiss();
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
    toast: _toast // expose the raw toast function for advanced usage
  };
}
