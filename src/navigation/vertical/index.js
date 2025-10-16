// ** Icon imports
import HomeIcon from 'mdi-material-ui/Home'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PublicIcon from '@mui/icons-material/Public';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WorkIcon from '@mui/icons-material/Work';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DomainIcon from '@mui/icons-material/Domain';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock'
import TaskIcon from '@mui/icons-material/Task'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      permission: 'dashboard',
      icon: HomeIcon,
      path: '/dashboard'
    },

    {
      sectionTitle: "Admin",
      permission: 'subadmin.list',
    },
    {
      title: 'Admin',
      permission: 'subadmin.list',
      icon: PersonOutlineIcon,
      path: '/admin'

    },
    {
      sectionTitle: "Organization",
      permission: 'org.list',
    },
    {
      title: 'Organization',
      permission: 'org.list',
      icon: CastForEducationIcon,
      path: '/organizations'
    },
    {
      sectionTitle: "College",
      permission: 'college.list',
    },
    {
      title: 'College',
      permission: 'college.list',
      icon: SchoolIcon,
      path: '/college'

    },
    {
      sectionTitle: "Roles & Permission",
      permission: 'rolespermission.list',
    },
    {
      title: 'Roles',
      permission: 'rolespermission.list',
      icon: SupervisorAccountIcon,
      path: '/roles'
    },
    {
      title: 'Permission',
      permission: 'rolespermission.list',
      icon: LockOpenIcon,
      path: '/permission'
    },
    {
      title: 'Website',
      icon: PublicIcon,
      children: [
        {
          title: 'Privacy Policy',
          icon: LockIcon,
          path: '/privacy-policy',
          permission: 'document.list',
        },
        {
          title: 'Terms and Conditions',
          icon: TaskIcon,
          path: '/terms-conditions',
          permission: 'document.list',
        },
      ]
    },
    // {
    //   sectionTitle: "Address",
    // },
    // {
    //   title: 'Address',
    //   icon: PublicIcon,
    //   path: '/country'
    // },
    // {
    //   sectionTitle: "Company",
    // },
    // {
    //   title: 'Company',
    //   icon: ApartmentIcon,
    //   path: '/company'
    // },
    // {
    //   sectionTitle: "Jobs",
    // },
    // {
    //   title: 'Jobs',
    //   icon: WorkIcon,
    //   path: '/jobs'
    // },
    // {
    //   sectionTitle: "Degree",
    // },
    // {
    //   title: 'Degree',
    //   icon: WorkspacePremiumIcon,
    //   path: '/degree'
    // },
    // {
    //   sectionTitle: "Department",
    // },
    // {
    //   title: 'Department',
    //   icon: DomainIcon,
    //   path: '/department'
    // },
  ]
}

export default navigation
