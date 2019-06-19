export const ENABLE_INFO_PANEL = 'ENABLE_INFO_PANEL';
export const DISABLE_INFO_PANEL = 'DISABLE_INFO_PANEL';
export const NEW_ERROR_MESSAGE = 'NEW_ERROR_MESSAGE';

export const enableInfoPanel = { type: ENABLE_INFO_PANEL, };

export const disableInfoPanel = { type: DISABLE_INFO_PANEL, };

export const newErrorMessage = error => ({ 
  error,
  type: NEW_ERROR_MESSAGE 
})