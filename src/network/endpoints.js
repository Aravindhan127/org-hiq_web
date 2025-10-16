// You can toggle between local and production easily
const ENV = "LOCAL"; // change to "PROD" for 
// const ENV = "SERVER"; // change to "PROD" for production

export const API_BASE_URL = "http://localhost:4003"
    ? "http://localhost:4003"   // your local API
    : "https://api.hiqlynks.com";

export const VELTECH_BASE_URL = ENV === "LOCAL"
    ? "http://localhost:4003"   // your local Veltech API
    : "https://veltech-alumni.hiqlynks.com";

// export const MEDIA_URL = "https://d1hj3r7039erwq.cloudfront.net"
export const ApiEndPoints = {
       AUTH: {
        login: `${API_BASE_URL}/public/api/v1/admin/login`,
        me: `${API_BASE_URL}/api/v1/admin/get-profile`,
        forgot: `${API_BASE_URL}/public/api/v1/admin/forgot-password-request`,
        verifotp: `${API_BASE_URL}/api/v1/admin/verify-forgot-password-otp`,
        reset: `${API_BASE_URL}/api/v1/admin/reset-password`,
        dashboard_redirect: (id) => `${API_BASE_URL}/api/v1/admin/get-dashboard-access?orgId=${id}`,
    },
    DASHBOARD: {
        count: `${API_BASE_URL}/api/v1/admin/get-dashboard-data`,
    },
    NOTIFICATION: {
        list: `${API_BASE_URL}/api/v1/admin/get-notifications`,
        markAsRead: `${API_BASE_URL}/api/v1/admin/notifications-mark-as-read`,
        getUnreadCount: `${API_BASE_URL}/api/v1/admin/get-notifications-unread-count`,
    },
    DOCUMENT: {
        document: (docsType) => `${API_BASE_URL}/api/v1/admin/documents/get-document?docsType=${docsType}`,
        edit: `${API_BASE_URL}/api/v1/admin/documents/update-document`,
    },
    GET_REGION: {
        country: `https://api.countrystatecity.in/v1/countries`,
        state: `https://api.countrystatecity.in/v1/countries/`,
        city: `https://api.countrystatecity.in/v1/countries/`
    },
    COLLEGE: {
        getList: `${API_BASE_URL}/api/v1/admin/college/get-colleges`,
        create: `${API_BASE_URL}/api/v1/admin/college/add-college`,
        edit: `${API_BASE_URL}/api/v1/admin/college/edit-college`,
        active_deactive: `${API_BASE_URL}/api/v1/admin/college/active-deactive-college`,
        getById: (id) => `${API_BASE_URL}/api/v1/admin/college/get-college-details?collegeId=${id}`,
        get_college_users: (id) => `${API_BASE_URL}/api/v1/admin/org-user/get-users?orgId=${id}`,
        get_college_user_detail: (id, userSeqId) => `${API_BASE_URL}/api/v1/admin/org-user/get-user-details?orgId=${id}&userSeqId=${userSeqId}`,
    },
    ORGANIZATION: {
        getList: `${API_BASE_URL}/api/v1/admin/organisation/get-organisations`,
        create: `${API_BASE_URL}/api/v1/admin/organisation/add-organisation`,
        edit: `${API_BASE_URL}/api/v1/admin/organisation/edit-organisation`,
        active_deactive: `${API_BASE_URL}/api/v1/admin/organisation/active-deactive-organisation`,
        getById: (id) => `${API_BASE_URL}/api/v1/admin/organisation/get-organisation-details?organisationId=${id}`,
        accept: `${API_BASE_URL}/api/v1/admin/org/accept`,
        reject: `${API_BASE_URL}/api/v1/admin/org/reject`,
    },
    ADMIN: {
        getRoles: `${API_BASE_URL}/api/v1/admin/get-roles`,
        get: `${API_BASE_URL}/api/v1/admin/sub-admin/get-admins`,
        create: `${API_BASE_URL}/api/v1/admin/sub-admin/add-admin`,
        edit: `${API_BASE_URL}/api/v1/admin/sub-admin/edit-admin`,
        active_deactive: (id) => `${API_BASE_URL}/api/v1/admin/sub-admin/active-deactive-admin?appAdminId=${id}`,
    },
    ROLES: {
        getRoles: `${API_BASE_URL}/api/v1/admin/role-permission/get-roles`,
        addRolesPermission: `${API_BASE_URL}/api/v1/admin/role-permission/add-role-with-permissions`,
        editRolesPermission: `${API_BASE_URL}/api/v1/admin/role-permission/edit-role-with-permissions`,
        roleById: (id) => `${API_BASE_URL}/api/v1/admin/role-permission/get-role-with-permissions?roleId=${id}`
    },
    PERMISSION: {
        getPermissions: `${API_BASE_URL}/api/v1/admin/role-permission/get-permissions`,
    },
    COUNTRY_STATE_CITY: {
        get: `${API_BASE_URL}/public/api/v1/get-common-list-data`,
    },
    // ADDRESS
    // STATE: {
    //     get: `${API_BASE_URL}/api/v1/admin/state/get-states`,
    //     create: `${API_BASE_URL}/api/v1/admin/state/create-state`,
    //     edit: `${API_BASE_URL}/api/v1/admin/state/edit-state`,
    //     active_deactive: `${API_BASE_URL}/api/v1/admin/state/active-deactive-state`,
    // },
    // CITY: {
    //     get: `${API_BASE_URL}/api/v1/admin/city/get-cities`,
    //     create: `${API_BASE_URL}/api/v1/admin/city/create-city`,
    //     edit: `${API_BASE_URL}/api/v1/admin/city/edit-city`,
    //     active_deactive: `${API_BASE_URL}/api/v1/admin/city/active-deactive-city`,
    // },
    // COMPANY: {
    //     get: `${API_BASE_URL}/api/v1/admin/company/get-companies`,
    //     create: `${API_BASE_URL}/api/v1/admin/company/create-company`,
    //     edit: `${API_BASE_URL}/api/v1/admin/company/edit-company`,
    //     active_deactive: `${API_BASE_URL}/api/v1/admin/company/active-deactive-company`,
    // },
    // JOBS: {
    //     get: `${API_BASE_URL}/api/v1/admin/job/get-job-titles`,
    //     create: `${API_BASE_URL}/api/v1/admin/job/create-job-title`,
    //     edit: `${API_BASE_URL}/api/v1/admin/job/edit-job-title`,
    //     active_deactive: `${API_BASE_URL}/api/v1/admin/job/active-deactive-job-title`,
    // },
    // DEGREE: {
    //     get: `${API_BASE_URL}/api/v1/admin/degree/get-degrees`,
    //     create: `${API_BASE_URL}/api/v1/admin/degree/create-degree`,
    //     edit: `${API_BASE_URL}/api/v1/admin/degree/edit-degree`,
    //     active_deactive: `${API_BASE_URL}/api/v1/admin/degree/active-deactive-degree`,
    // },
    // DEPARTMENT: {
    //     get: `${API_BASE_URL}/api/v1/admin/department/get-departments`,
    //     create: `${API_BASE_URL}/api/v1/admin/department/create-department`,
    //     edit: `${API_BASE_URL}/api/v1/admin/department/edit-department`,
    //     active_deactive: `${API_BASE_URL}/api/v1/admin/department/active-deactive-department`,
    // },
}
