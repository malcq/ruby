import { SHOW_TOAST, HIDE_TOAST } from '../actionNames';

export const showToast = (data) => {
  return {
    type: SHOW_TOAST,
    data
  };
};

export const hideToast = () => {
  return { type: HIDE_TOAST };
};
