const Table = theme => {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: theme.shadows[0],
          backgroundColor: theme.palette.common.white,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 12,
          overflow: 'hidden'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '& .MuiTableRow-root': {
            backgroundColor: theme.palette.primary.dark
          },
          '& .MuiTableCell-head': {
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: 0,
            color: theme.palette.common.white,
            borderBottom: 'none',
            '&:first-of-type': { borderTopLeftRadius: 12 },
            '&:last-of-type': { borderTopRightRadius: 12 }
          }
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-body': {
            letterSpacing: 0,
            color: theme.palette.text.primary,
            verticalAlign: 'middle',
            '&:not(.MuiTableCell-sizeSmall):not(.MuiTableCell-paddingCheckbox):not(.MuiTableCell-paddingNone)': {
              paddingTop: theme.spacing(2.5),
              paddingBottom: theme.spacing(2.5)
            }
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head:first-of-type, & .MuiTableCell-root:first-of-type ': {
            paddingLeft: theme.spacing(5)
          },
          '& .MuiTableCell-head:last-child, & .MuiTableCell-root:last-child': {
            paddingRight: theme.spacing(5)
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.palette.divider}`,
          fontSize: '0.875rem',
          '& .MuiButton-root': {
            textTransform: 'uppercase',
            color: theme.palette.text.secondary
          }
        },
        body: {
          '&:first-of-type': { fontWeight: 600 }
        },
        stickyHeader: {
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.common.white
        }
      }
    }
  }
}

export default Table
