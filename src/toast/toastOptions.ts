import { CommonOptions } from "vue-toastification/dist/types/types";
import { POSITION } from "vue-toastification";
export const toastOptions: Toast = {
  position: POSITION.TOP_CENTER,
  timeout: 3000,
  pauseOnHover: false,
  closeOnClick: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

export interface Toast extends CommonOptions {
  pauseOnHover: boolean;
}
