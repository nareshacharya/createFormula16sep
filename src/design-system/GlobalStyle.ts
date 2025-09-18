import { createGlobalStyle } from 'styled-components'
import { colors, typography } from './theme'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${typography.fontFamily.primary};
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.normal};
    line-height: ${typography.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${colors.neutral[50]};
    color: ${colors.neutral[800]};
    overflow-x: hidden;
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: none;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.neutral[100]};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.neutral[300]};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.neutral[400]};
  }

  /* Touch-friendly tap highlights */
  @media (hover: none) and (pointer: coarse) {
    * {
      -webkit-tap-highlight-color: transparent;
    }
  }

  /* Responsive typography */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }
` 