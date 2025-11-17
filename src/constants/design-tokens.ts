/**
 * WeaveWorks ERP Design System Tokens
 *
 * 블랙 & 화이트 기반 미니멀 디자인
 * Primary Color: #1694FF
 */

export const colors = {
  primary: '#1694FF',
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    100: '#F5F5F5',
    200: '#DDDDDD',
    300: '#888888',
    400: '#555555',
    500: '#333333',
    600: '#222222',
    700: '#111111',
  },
} as const;

export const typography = {
  fontFamily: {
    primary: 'Pretendard, Inter, sans-serif',
  },
  fontSize: {
    headingLg: '24px',
    headingMd: '20px',
    headingSm: '18px',
    body: '16px',
    caption: '13px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  input: '12px',
  lg: '16px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;
