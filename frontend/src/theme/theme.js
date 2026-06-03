import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F766E'
    },
    secondary: {
      main: '#C2410C'
    },
    background: {
      default: '#F5F7FB',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#102A43',
      secondary: '#627D98'
    }
  },
  typography: {
    fontFamily: '"Space Grotesk", "Source Sans 3", system-ui, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,1))'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;
