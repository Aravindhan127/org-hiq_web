// ** Theme Config Imports
import themeConfig from 'src/configs/themeConfig'

const Button = theme => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 99,
          lineHeight: 1.71,
          letterSpacing: '0.3px',
          padding: `${theme.spacing(1.875, 3)}`,
          textTransform: 'capitalize',
        },
        contained: {
          boxShadow: theme.shadows[3],
          padding: `${theme.spacing(1.875, 5.5)}`,
          color: '#FFF',
          background: theme.palette.customColors.primaryGradient,
          '&:hover': {
            background: 'linear-gradient(90deg,rgb(128, 28, 185) 0%,rgb(238, 79, 151) 80%)',
          },
        },
        outlined: {
          padding: `${theme.spacing(1.625, 5.25)}`
        },
        sizeSmall: {
          padding: `${theme.spacing(1, 2.25)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(1, 3.5)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(0.75, 3.25)}`
          }
        },
        sizeLarge: {
          padding: `${theme.spacing(2.125, 5.5)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(2.125, 6.5)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(1.875, 6.25)}`
          }
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: themeConfig.disableRipple
      }
    }
  }
}

export default Button
