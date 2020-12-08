import { types } from "../types/types";



export const startOpenModal = ()=>{
    return {
        type: types.uiOpenModal
      };
}
export const startCloseModal = ()=>{
    return {
        type: types.uiCloseModal
      };
}