export const ENABLE_INFO_PANEL = 'ENABLE_INFO_PANEL';
export const DISABLE_INFO_PANEL = 'DISABLE_INFO_PANEL';
export const RAISE_ERROR = 'RAISE_ERROR';
export const RECOVER_FROM_ERROR = 'RECOVER_FROM_ERROR';

export const enableInfoPanel = { type: ENABLE_INFO_PANEL, };

export const disableInfoPanel = { type: DISABLE_INFO_PANEL, };

export const raiseError = error => ({ 
  error,
  type: RAISE_ERROR 
})