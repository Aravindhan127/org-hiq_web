import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import moment from "moment";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useState } from "react";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError } from "src/utils/utils";
import { useAuth } from "src/hooks/useAuth";
import authConfig from '../../configs/auth'
function TableOrg({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleApproveReject,
    rolePremission,
    isMasterAdmin,
    toggleStatus,
    devBaseUrl,
    toggleDelete,
}) {
    const navigate = useNavigate();
    const { setRolePermission, setIsMasterAdmin, setUser, login } = useAuth()
    const [dataLoading, setDataLoading] = useState(false);
    const [orgData, setOrgData] = useState([]);
    const statusColors = {
        Active: '#8bc34a',
        Inactive: '#FFB400',
        Rejected: '#f44336',  // Red for rejected
        Pending: '#9e9e9e',   // Grey for pending
    };
    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))

    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions' && field !== 'status' && field !== 'viewDetail') {
            setDataLoading(true);

            axiosInstance
                .get(ApiEndPoints.AUTH.dashboard_redirect(row.orgId))
                .then((response) => {
                    console.log("response", response)
                    const { token, user } = response.data.data;

                    // Encode token and user data in URL (alternative: localStorage)
                    const encodedToken = encodeURIComponent(token);
                    const encodedUser = encodeURIComponent(JSON.stringify(user));

                    // Redirect to sub-admin panel
                    window.open(`${devBaseUrl}/auth-redirect?token=${encodedToken}&user=${encodedUser}`, "_blank");
                    console.log("devBaseUrl", devBaseUrl, "encodedToken", encodedToken, "encodedUser", encodedUser)
                })
                .catch((error) => {
                    toastError(error);
                })
                .finally(() => {
                    setDataLoading(false);
                });
        }
    };


    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: index + 1, // Add `id` for compatibility with CustomDataGrid
        status: row.isRejected ? 'Rejected' : row.isApproved ? (row.isActive ? 'Active' : 'Inactive') : 'Pending',
    }));


    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'org.edit') || isMasterAdmin === true;

    const hasActiveDeactivePermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'org.activedeactive') || isMasterAdmin === true;

    const btnStatusColors = {
        approve: '#8bc34a',  // Green for accepted
        reject: '#f44336',  // Red for rejected
    };

    const ButtonChip = styled(Chip)(({ label }) => ({
        backgroundColor: btnStatusColors[label.toLowerCase()] || '#ccc', // Default gray if label doesn't match
        borderRadius: "8px",
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px',
    }));
    console.log("devBaseUrl", devBaseUrl)
    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        columns={[
            {
                field: 'id',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                filterable: true,
                headerName: 'Organization ID',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row.id}>
                    {row?.id}
                </Typography>
            },
            {
                field: 'orgName',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                filterable: true,
                headerName: 'Organization Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.orgName}>
                    {row?.orgName}
                </Typography>
            },
            {
                field: 'streetAddress',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                filterable: true,
                headerName: 'Address',
                renderCell: (params) => (
                    <Typography noWrap variant="body2" textTransform={'capitalize'} title={params?.row.streetAddress}>
                        {params?.row.streetAddress === null ? '-' : params?.row.streetAddress}</Typography>
                ),
            },
            {
                field: 'city',
                flex: 0.3,
                minWidth: 150,
                sortable: true,
                filterable: true,
                headerName: 'City',
                renderCell: (params) => (
                    <Typography noWrap variant="body2" textTransform={'capitalize'} title={params?.row.city}>
                        {params?.row.city === null ? '-' : params?.row.city}</Typography>
                ),
            },
            {
                field: 'state',
                flex: 0.3,
                minWidth: 150,
                sortable: true,
                filterable: true,
                headerName: 'State',
                renderCell: (params) => (
                    <Typography noWrap variant="body2" textTransform={'capitalize'} title={params?.row?.state}>
                        {params?.row?.state === null ? '-' : params?.row?.state}</Typography>
                ),
            },
            {
                field: 'country',
                flex: 0.3,
                minWidth: 150,
                sortable: true,
                filterable: true,
                headerName: 'Country',
                renderCell: (params) => (
                    <Typography noWrap variant="body2" textTransform={'capitalize'} title={params?.row?.country}>
                        {params?.row?.country === null ? '-' : params?.row?.country}</Typography>
                ),
            },
            {
                field: 'orgEmail',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                filterable: true,
                headerName: 'Email',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.orgEmail}>
                    {row?.orgEmail}
                </Typography>
            },
            {
                field: 'contactNumber',
                minWidth: 180,
                sortable: true,
                filterable: true,
                headerName: 'Phone Number',
                renderCell: (params) => (
                    <Typography noWrap variant="body2" textTransform={'capitalize'} title={params?.row?.contactNumber}>
                        {params?.row?.contactNumber ? `+${params.row.contactNumber}` : '-'}</Typography>
                ),
            },
            {
                field: 'status',
                minWidth: 150,
                sortable: true,
                filterable: true,
                headerName: 'Status',
                renderCell: ({ row }) => {
                    let statusLabel = 'Pending'; // Default status

                    if (row.isRejected) {
                        statusLabel = 'Rejected';
                    } else if (row.isApproved) {
                        statusLabel = row.isActive ? 'Active' : 'Inactive';
                    }

                    return (
                        <CustomChip
                            label={row?.status || statusLabel}
                            onClick={
                                hasActiveDeactivePermission && row.isApproved
                                    ? (e) => toggleStatus(e, row)
                                    : undefined
                            }
                            style={{
                                cursor: hasActiveDeactivePermission && row.isApproved ? 'pointer' : 'not-allowed',
                            }}
                        />
                    );
                },
            },

            {
                field: 'createdAt',
                minWidth: 280,
                sortable: true,
                filterable: true,
                headerName: 'Created At',
                renderCell: ({ row }) =>
                    <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.createdAt}>
                        {moment(row?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                    </Typography>
            },
            ...(hasEditPermission
                ? [{
                    field: 'Actions',
                    flex: 0,
                    minWidth: 350,
                    sortable: true,
                    filterable: true,
                    headerName: 'Actions',
                    renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
                        <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleEdit(e, "edit", row)}>
                            <EditIcon />
                        </IconButton>

                        <ButtonChip
                            size="medium"
                            // disabled={row.isApproved === true || row.isCompletedProfile === false}
                            disabled={row.isApproved === true}
                            label="Approve"
                            onClick={() => toggleApproveReject('approve', row.orgId)}
                        />
                        {!row.isApproved && !row.isRejected && (
                            <ButtonChip
                                size="medium"
                                // disabled={row.isRejected === true || row.isCompletedProfile === false}
                                disabled={row.isRejected === true}
                                label="Reject"
                                onClick={() => toggleApproveReject('reject', row.orgId)}
                            />
                        )}
                    </Box>
                }]
                : []),
            {
                field: 'viewDetail',
                minWidth: 180,
                sortable: true,
                filterable: true,
                headerName: 'View Detail',
                renderCell: ({ row }) =>
                    <IconButton size="small" color="primary" variant="outlined" onClick={() => navigate(`/organizations/${row?.orgId}`)} >
                        <RemoveRedEyeIcon />
                    </IconButton>
            },
            // {
            //     field: 'viewUser',
            //     minWidth: 180,
            //     sortable: true,
            //     filterable: true,
            //     headerName: 'View User',
            //     renderCell: ({ row }) =>
            //         <IconButton size="small" color="primary" variant="outlined" onClick={() => handleViewDetails(row.orgId)} >
            //             <RemoveRedEyeIcon />
            //         </IconButton>
            // },
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableOrg
