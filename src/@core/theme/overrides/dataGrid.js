const DataGrid = theme => {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          color: theme.palette.text.primary,
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none'
          }
        },
        toolbarContainer: {
          paddingRight: `${theme.spacing(5)} !important`,
          paddingLeft: `${theme.spacing(3.25)} !important`
        },
        columnHeaders: {
          backgroundColor: `${theme.palette.primary.dark} !important`,
          borderRadius: '12px 12px 0 0',
          color: `${theme.palette.common.white} !important`
        },
        columnHeader: {
          color: `${theme.palette.common.white} !important`,
          '&:not(.MuiDataGrid-columnHeaderCheckbox)': {
            padding: theme.spacing(4),
            '&:first-of-type': {
              paddingLeft: theme.spacing(5)
            }
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(5)
          }
        },
        columnHeaderCheckbox: {
          // maxWidth: '58px !important',
          // minWidth: '58px !important'
        },
        columnHeaderTitleContainer: {
          padding: 0,
          color: `${theme.palette.common.white} !important`,
        },
        columnHeaderTitle: {
          color: `${theme.palette.common.white} !important`,
          fontSize: '0.8125rem',
          fontWeight: 700,
          lineHeight: '24px',
          letterSpacing: 0,
          textTransform: 'none'
        },
        columnSeparator: {
          color: theme.palette.divider
        },
        virtualScroller: {
          // marginTop: '54px !important'
        },
        virtualScrollerRenderZone: {
          '& .MuiDataGrid-row': {
            // maxHeight: '50px !important',
            // minHeight: '50px !important'
          }
        },
        row: {
          '&:hover': { backgroundColor: theme.palette.action.hover },
          '&:last-child': {
            '& .MuiDataGrid-cell': { borderBottom: 0 }
          }
        },
        cell: {
          // maxHeight: '50px !important',
          // minHeight: '50px !important',
          // lineHeight: '20px !important',
          borderColor: theme.palette.divider,
          '&:not(.MuiDataGrid-cellCheckbox)': {
            padding: theme.spacing(4),
            '&:first-of-type': {
              paddingLeft: theme.spacing(5)
            }
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(5)
          },
          '&:focus, &:focus-within': {
            outline: 'none'
          }
        },
        // cellCheckbox: {
        //   maxWidth: '58px !important',
        //   minWidth: '58px !important'
        // },
        editInputCell: {
          padding: 0,
          color: theme.palette.text.primary,
          '& .MuiInputBase-input': {
            padding: 0
          }
        },
        footerContainer: {
          minHeight: '50px !important',
          borderTop: `1px solid ${theme.palette.divider}`,
          '& .MuiTablePagination-toolbar': {
            minHeight: '50px !important'
          },
          '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel': {
            color: theme.palette.text.primary
          }
        }
      },
      defaultProps: {
        rowHeight: 50,
        headerHeight: 54
      }
    }
  }
}

export default DataGrid