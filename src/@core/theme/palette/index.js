const DefaultPalette = (mode, skin, themeColor) => {
  const lightColor = '58, 53, 65';
  const darkColor = '231, 227, 252';
  const mainColor = mode === 'light' ? lightColor : darkColor;

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return '#FFF';
    } else if (skin === 'bordered' && mode === 'dark') {
      return '#312D4B';
    } else if (mode === 'light') {
      return '#F5F4F9';
    } else return '#28243D';
  };

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      darkBg: '#28243D',
      lightBg: '#F4F5FA',
      // primaryGradient kept for components that reference it, but now deep navy
      primaryGradient: 'linear-gradient(90deg, #1E2A78 0%, #1E2A78 100%)',
      bodyBg: mode === 'light' ? '#F4F5FA' : '#28243D',
      tableHeaderBg: mode === 'light' ? '#F9FAFC' : '#3D3759'
    },
    common: {
      black: '#000',
      white: '#FFF'
    },
    mode: mode,
    primary: {
      light: '#2E3FA3',
      main: '#1E2A78',
      dark: '#16205C',
      contrastText: '#FFF',
    },
    secondary: {
      light: '#6C7BD3',
      main: '#3D4BB3',
      dark: '#2B3786',
      contrastText: '#FFF'
    },
    success: {
      light: '#6AD01F',
      main: '#56CA00',
      dark: '#4CB200',
      contrastText: '#FFF'
    },
    error: {
      light: '#FF6166',
      main: '#FF4C51',
      dark: '#E04347',
      contrastText: '#FFF'
    },
    warning: {
      light: '#FFCA64',
      main: '#FFB400',
      dark: '#E09E00',
      contrastText: '#FFF'
    },
    info: {
      light: '#32BAFF',
      main: '#16B1FF',
      dark: '#139CE0',
      contrastText: '#FFF'
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#D5D5D5',
      A200: '#AAAAAA',
      A400: '#616161',
      A700: '#303030'
    },
    neutral: {
      90: '#0E163F',
      80: '#142057',
      70: '#1A2A6F',
      60: '#23368F',
      50: '#2E45B0',
      40: '#6C7BD3',
      30: '#AAB6F0',
      20: '#DCE2FA',
      10: '#F5F7FF',
    },
    text: {
      primary: `rgba(${mainColor}, 0.87)`,
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.38)`
    },
    divider: `rgba(${mainColor}, 0.12)`,
    background: {
      paper: mode === 'light' ? '#FFF' : '#312D4B',
      default: defaultBgColor()
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.3)`,
      disabledBackground: `rgba(${mainColor}, 0.18)`,
      focus: `rgba(${mainColor}, 0.12)`
    }
  }
}

export default DefaultPalette;
