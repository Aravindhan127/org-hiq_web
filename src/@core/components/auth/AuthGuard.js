// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useNavigate, useLocation } from 'react-router-dom'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

// ** Config
import authConfig from 'src/configs/auth'


const AuthGuard = (props) => {
  const { children, fallback } = props;
  const auth = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname + location.search + location.hash;
    const isUserLoggedIn =
      auth.user !== null || window.localStorage.getItem(authConfig.storageUserDataKeyName);

    if (!isUserLoggedIn) {
      if (currentPath !== '/') {
        navigate(`/login?redirect=${currentPath}`);
      } else {
        navigate('/login');
      }
    } else if (currentPath === '/login') {
      // Redirect to dashboard if user is authenticated and tries to access login
      navigate('/dashboard');
    }
  }, [auth.user, location.pathname, navigate]);

  if (auth.loading || auth.user === null) {
    return fallback;
  }

  return children;
};

export default AuthGuard;


// const AuthGuard = props => {
//   const { children, fallback } = props
//   const auth = useAuth()

//   const navigate = useNavigate()
//   const location = useLocation()

//   useEffect(
//     () => {
//       const currentPath = location.pathname + location.search + location.hash
//       if (auth.user === null && !window.localStorage.getItem(authConfig.storageUserDataKeyName)) {
//         if (currentPath !== '/') {
//           navigate(`/login?redirect=${currentPath}`)
//         } else {
//           navigate('/login')
//         }
//       }
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   )

//   if (auth.loading || auth.user === null) {
//     return fallback
//   }

//   return children
// }

// export default AuthGuard
