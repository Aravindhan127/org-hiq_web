import React, { Suspense } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import FallbackSpinner from './@core/components/spinner'
import Box from '@mui/material/Box'

import AuthGuard from 'src/@core/components/auth/AuthGuard'
import UserLayout from './layouts/UserLayout'
import BlankLayout from './@core/layouts/BlankLayout'
// import BlankLayoutWithAppBar from './@core/layouts/BlankLayoutWithAppBar'
import AclGuard from './@core/components/auth/AclGuard'
import GuestGuard from './@core/components/auth/GuestGuard'
import { defaultACLObj } from './configs/acl'
import AuthLayout from './layouts/AuthLayout'
import UserRolesPage from './pages/roles'
import UserPermissionPage from './pages/permission'
import AddUserRolePage from './pages/roles/add-roles'
import EditUserRolePage from './pages/roles/edit-roles'
import CollegeUser from './pages/college/clgUsers'
import OrganizationUsers from './pages/organization/orgUsers'
import NotificationPage from './pages/notification'
import CreatePassword from './pages/reset-pwd'
import CollegeUserDetail from './pages/college/collegeUserDetail'
import OrgUserDetail from './pages/organization/orgUserDetail'


//website 
const CareerCategoriesPage = React.lazy(() => import('./pages/website-content/career-section/career-categories'))
const CareerPage = React.lazy(() => import('./pages/website-content/career-section'))
const FaqsPage = React.lazy(() => import('./pages/website-content/faqs'))
const TermsandConditionPage = React.lazy(() => import('./pages/website-content/termsandcondition'))
const TestimonialsPage = React.lazy(() => import('./pages/website-content/testimonials'))
const ContactUsPage = React.lazy(() => import('./pages/website-content/contact-us'))
const PrivacyPolicyPage = React.lazy(() => import('./pages/website-content/privacy-policy'))
const BlogPage = React.lazy(() => import('./pages/website-content/blog'))

//admin
const HomePage = React.lazy(() => import('./pages/home'))
const DashboardPage = React.lazy(() => import('./pages/dashboard'))
const LoginPage = React.lazy(() => import('./pages/login'))
const ForgotPassword = React.lazy(() => import('./pages/login/forgotpassword'))

const Organization = React.lazy(() => import('./pages/organization'))
const OrganizationDetail = React.lazy(() => import('./pages/organization/organizationDetail'))
const OrganizationForm = React.lazy(() => import('./pages/organization/organizationForm'))
const College = React.lazy(() => import('./pages/college'))
const CollegeForm = React.lazy(() => import('./pages/college/collegeForm'))
const CollegeDetail = React.lazy(() => import('./pages/college/collegeDetail'))
const Country = React.lazy(() => import('./pages/country'))
const State = React.lazy(() => import('./pages/state'))
const City = React.lazy(() => import('./pages/city'))
const Admin = React.lazy(() => import('./pages/admin'))
const Company = React.lazy(() => import('./pages/company'))
const Jobs = React.lazy(() => import('./pages/jobs'))
const Degree = React.lazy(() => import('./pages/degree'))
const Department = React.lazy(() => import('./pages/department'))


const Page401 = React.lazy(() => import('./pages/401'))
const Page404 = React.lazy(() => import('./pages/404'))

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>
  }
}

function App() {
  const aclAbilities = defaultACLObj

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <AclGuard aclAbilities={aclAbilities}>
          <Routes>
          <Route element={<BlankLayout><Outlet /></BlankLayout>}>
            <Route path='/401' element={<Page401 />} />
            <Route path='/404' element={<Page404 />} />

            <Route element={<AuthLayout><Outlet /></AuthLayout>}>
              <Route element={<Guard guestGuard><Outlet /></Guard>}>
                <Route path='/login' element={<LoginPage />}></Route>
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/create-password' element={<CreatePassword />} />
              </Route>
            </Route>
          </Route>

          <Route element={<UserLayout><Outlet /></UserLayout>}>
            <Route element={<Guard authGuard><Outlet /></Guard>}>
              <Route path='' element={<HomePage />} />
              <Route path='/dashboard' element={<DashboardPage />} />

              <Route path='/organizations' element={<Organization />} />
              <Route path='/organizations-form' element={<OrganizationForm />} />
              <Route path='/organizations/:orgId' element={<OrganizationDetail />} />
              <Route path='/org-users/:id' element={<OrganizationUsers />} />
              <Route path='/org-users/:id/:userSeqId' element={<OrgUserDetail />} />

              <Route path='/college' element={<College />} />
              <Route path='/college-form' element={<CollegeForm />} />
              <Route path='/college/:collegeId' element={<CollegeDetail />} />
              <Route path='/clg-users/:id' element={<CollegeUser />} />
              <Route path='/clg-users/:id/:userSeqId' element={<CollegeUserDetail />} />

              <Route path='/country' element={<Country />} />
              <Route path='/state/:id' element={<State />} />
              <Route path='/city/:id/:cid' element={<City />} />

              <Route path='/company' element={<Company />} />
              <Route path='/jobs' element={<Jobs />} />
              <Route path='/degree' element={<Degree />} />
              <Route path='/department' element={<Department />} />

              <Route path='/admin' element={<Admin />} />

              <Route path='/roles' element={<UserRolesPage />} />
              <Route path='/add-roles' element={<AddUserRolePage />} />
              <Route path='/edit-roles/:roleId' element={<EditUserRolePage />} />

              <Route path='/notifications' element={<NotificationPage />} />
              <Route path='/permission' element={<UserPermissionPage />} />

              {/* website */}
              <Route path='/career-section' element={<CareerPage />} />
              <Route path='/career-categories' element={<CareerCategoriesPage />} />
              <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
              <Route path='/terms-conditions' element={<TermsandConditionPage />} />
              <Route path='/testimonials' element={<TestimonialsPage />} />
              <Route path='/contact-us' element={<ContactUsPage />} />
              <Route path='/faqs' element={<FaqsPage />} />
              <Route path='/blog' element={<BlogPage />} />
            </Route>
          </Route>

          {/* If no route found redirect it to --> /404 */}
          <Route path='*' element={<Navigate to='/404' replace />} />

          </Routes>
        </AclGuard>
      </Box>
    </Suspense>
  );
}

export default App;
