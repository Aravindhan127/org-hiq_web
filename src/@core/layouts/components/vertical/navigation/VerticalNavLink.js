// ** Next Imports
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import { styled, useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'

// ** Styled Components
const MenuNavLink = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  borderRadius: 999,
  borderTopRightRadius: 999,
  borderBottomRightRadius: 999,
  color: theme.palette.text.primary,
  transition: 'padding-left .25s ease-in-out, background-color .2s ease-in-out, box-shadow .2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(30, 42, 120, 0.06)',
  },
  '&.active': {
    '&, &:hover': {
      boxShadow: theme.shadows[1],
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    '& .MuiTypography-root, & .MuiListItemIcon-root': {
      color: `${theme.palette.common.white} !important`,
    }
  }

}))

const MenuItemTextMetaWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({
  item,
  parent,
  navHover,
  settings,
  navVisible,
  isSubToSub,
  collapsedNavWidth,
  toggleNavVisibility,
  navigationBorderWidth
}) => {
  // ** Hooks
  const theme = useTheme()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // ** Vars
  const { skin, navCollapsed } = settings
  const IconTag = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

  const conditionalBgColor = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return {
        color: `rgba(${theme.palette.customColors.dark}, 0.87)`,
        '&:hover': {
          backgroundColor: `rgba(${theme.palette.customColors.dark}, 0.04)`
        }
      }
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return {
        color: `rgba(${theme.palette.customColors.light}, 0.87)`,
        '&:hover': {
          backgroundColor: `rgba(${theme.palette.customColors.light}, 0.04)`
        }
      }
    } else return {}
  }

  const isNavLinkActive = () => {
    if (location.pathname === item.path || handleURLQueries({ ...location, query: searchParams }, item.path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <ListItem
        disablePadding
        className='nav-link'
        disabled={item.disabled || false}
        sx={{ mt: 1.5, px: '0 !important' }}
      >
        {/* <Link to={item.path === undefined ? '/' : `${item.path}`}> */}
        <MenuNavLink
          to={item.path === undefined ? '/' : `${item.path}`}
          component={NavLink}
          className={isNavLinkActive() ? 'active' : ''}
          {...(item.openInNewTab ? { target: '_blank' } : null)}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
            if (navVisible) {
              toggleNavVisibility()
            }
          }}
          sx={{
            py: 1.25,
            ...conditionalBgColor(),
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            pl: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24) / 8 : 3.5,
            pr: navCollapsed && !navHover ? ((collapsedNavWidth - navigationBorderWidth - 24) / 2 - 5) / 4 : 2.5
          }}
        >
          {isSubToSub ? null : (
            <ListItemIcon
              sx={{
                color: 'text.secondary',
                transition: 'margin .25s ease-in-out',
                ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2.5 }),
                ...(parent ? { ml: 1.25, mr: 3.75 } : {}) // This line should be after (navCollapsed && !navHover) condition for proper styling
              }}
            >
              <UserIcon
                icon={IconTag}
                componentType='vertical-menu'
                iconProps={{
                  sx: {
                    fontSize: '0.875rem',
                    ...(!parent ? { fontSize: '1.25rem' } : {}),
                    ...(parent && item.icon ? { fontSize: '0.875rem' } : {})
                  },
                }}
              />
            </ListItemIcon>
          )}

          <MenuItemTextMetaWrapper
            sx={{
              ...(isSubToSub ? { ml: 9 } : {}),
              ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
            }}
          >
            <Typography
              {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                noWrap: true
              })}
            >
              <Translations text={item.title} />
            </Typography>
            {item.badgeContent ? (
              <Chip
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{
                  ml: 1.25,
                  height: 20,
                  fontWeight: 500,
                  '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                }}
              />
            ) : null}
          </MenuItemTextMetaWrapper>
        </MenuNavLink>
        {/* </Link> */}
      </ListItem>
    </CanViewNavLink>
  )
}

export default VerticalNavLink
