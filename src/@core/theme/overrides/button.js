// ** Theme Config Imports
import themeConfig from 'src/configs/themeConfig'

const Button = theme => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 12,
          minHeight: 44,
          lineHeight: 1.2,
          letterSpacing: '0.3px',
          padding: `${theme.spacing(1.25, 3)}`,
          textTransform: 'capitalize',
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': { background: theme.palette.primary.dark },
          '& .MuiButton-startIcon, & .MuiButton-endIcon': { marginTop: 0, marginBottom: 0 },
        },
        contained: {
          boxShadow: theme.shadows[1],
          padding: `${theme.spacing(1.25, 4)}`
        },
        outlined: {
          padding: `${theme.spacing(1.25, 4)}`,
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          '&:hover': { borderColor: theme.palette.primary.dark, backgroundColor: 'rgba(30,42,120,0.06)' }
        },
        sizeSmall: {
          minHeight: 36,
          padding: `${theme.spacing(0.75, 2)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(0.75, 3)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(0.5, 3)}`
          }
        },
        sizeLarge: {
          minHeight: 48,
          padding: `${theme.spacing(1.5, 5)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(1.5, 6)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(1.25, 5.5)}`
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
