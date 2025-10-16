import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useParams } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
import { axiosInstance } from "src/network/adapter";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
function TableOrgUser({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    rolePremission,
    isMasterAdmin,
    toggleEdit,
    toggleDelete,
}) {

    const statusColors = {
        Accepted: '#8bc34a',
        Pending: '#FFB400',
    }

    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))

    const navigate = useNavigate();
    const { id } = useParams();
    console.log("id", id)
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions' && field !== 'status') {
            let userSeqId = row?.userSeqId;
            navigate(`/org-users/${id}/${userSeqId}`);
        }
    };

    const mappedRows = rows.map((row, index) => ({
        ...row,
        isRejected: row?.status === 'rejected',
        id: index + 1,
        firstName: row?.appUser?.firstName,
        lastName: row?.appUser?.lastName,
        userEmail: row?.appUser?.userEmail,
        city: row?.appUser?.city,
        state: row?.appUser?.state,
        country: row?.appUser?.country,
    }));

    const hasActiveDeactivePermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'orgUser.approvereject') || isMasterAdmin === true;

    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        columns={[
            {
                field: 'id',
                minWidth: 100,
                flex: 0.1,
                sortable: true,
                headerName: 'ID',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row.id}>
                    {row.id ? row.id : '-'}
                </Typography>
            },

            {
                field: 'firstName',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                headerName: 'User Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.appUser?.firstName}>
                    {row?.appUser?.firstName && row?.appUser?.lastName
                        ? `${row?.appUser?.firstName} ${row?.appUser?.lastName}`
                        : '-'}

                </Typography>
            },

            {
                field: 'userEmail',
                minWidth: 200,
                flex: 0.1,
                sortable: true,
                headerName: 'Email',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.appUser?.userEmail}>
                    {row?.userEmail ? row?.userEmail : '-'}
                </Typography>
            },
            {
                field: 'country',
                minWidth: 200,
                flex: 0.1,
                sortable: true,
                headerName: 'Country',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.country}>
                    {row?.country ? row?.country : '-'}
                </Typography>
            },
            {
                field: 'state',
                minWidth: 200,
                flex: 0.1,
                sortable: true,
                headerName: 'State',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.state}>
                    {row?.state ? row?.state : '-'}
                </Typography>
            },
            {
                field: 'city',
                minWidth: 200,
                flex: 0.1,
                sortable: true,
                headerName: 'City',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.city}>
                    {row?.city ? row?.city : '-'}
                </Typography>
            },
            {
                field: 'profileBio',
                minWidth: 200,
                sortable: true,
                headerName: 'Profile Bio',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.profileBio}>
                    {row?.profileBio ? row?.profileBio : '-'}
                </Typography>
            },
            {
                field: 'job',
                minWidth: 150,
                sortable: true,
                headerName: 'Job',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.job}>
                    {row?.job ? row?.job : '-'}
                </Typography>
            },
            {
                field: 'company',
                minWidth: 150,
                sortable: true,
                headerName: 'Company',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.company}>
                    {row?.company ? row?.company : '-'}
                </Typography>
            },
            {
                field: 'status',
                minWidth: 180,
                sortable: true,
                headerName: 'Status',
                renderCell: ({ row }) => (
                    <CustomChip
                        label={row.status === 'pending' ? 'Pending' : row.status === 'accepted' ? 'Accepted' : 'Rejected'}
                        color={
                            row.status === 'pending' ? 'warning' : row.status === 'accepted' ? 'success' : 'error'
                        }
                    />
                )
            },
            {
                field: 'rejectReason',
                minWidth: 160,
                sortable: true,
                headerName: 'Reject Reason',
                renderCell: ({ row }) =>
                    row.status === 'rejected' ? (
                        <Typography
                            noWrap
                            variant='body2'
                            textTransform={'capitalize'}
                            title={row?.rejectReason}
                        >
                            {row?.rejectReason || '-'}
                        </Typography>
                    ) : (
                        <Typography
                            noWrap
                            variant='body2'
                            textTransform={'capitalize'}
                            title="N/A"
                        >
                            N/A
                        </Typography>
                    )
            },
            {
                field: 'Actions',
                flex: 0,
                minWidth: 50,
                sortable: true,
                headerName: 'Actions',
                renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
                    <IconButton size="small" color="primary" variant="outlined" onClick={() => navigate(`/org-users/${id}/${row?.userSeqId}`)} >
                        <RemoveRedEyeIcon />
                    </IconButton>
                </Box>
            }
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableOrgUser
