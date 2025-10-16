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
function TableCollegeUser({
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

    const btnStatusColors = {
        approve: '#8bc34a',  // Green for accepted
        reject: '#f44336',  // Red for rejected
    };

    const navigate = useNavigate();
    const { id } = useParams();
    console.log("id", id)
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions' && field !== 'status') {
            let userSeqId = row?.userSeqId;
            navigate(`/clg-users/${id}/${userSeqId}`);
        }
    };

    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row?.userSeqId,
        index: index + 1,
        firstName: row?.appUser?.firstName,
        lastName: row?.appUser?.lastName,
        userEmail: row?.appUser?.userEmail,
        city: row?.appUser?.city,
        state: row?.appUser?.state,
        country: row?.appUser?.country,
        deptName: row?.department?.deptName,
        degreeName: row?.department?.degreeName
    }))
    const hasActiveDeactivePermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'collegeUser.approvereject') || isMasterAdmin === true;
    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        columns={[
            {
                field: 'id',
                minWidth: 120,
                flex: 0.1,
                sortable: true,
                headerName: 'User ID',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.index}>
                    {row?.index ? row?.index : '-'}
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
                field: 'userType',
                minWidth: 120,
                flex: 0.1,
                sortable: true,
                headerName: 'User Type',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.userType}>
                    {row?.userType ? row?.userType : '-'}
                </Typography>
            },

            {
                field: 'passoutYear',
                flex: 0.3,
                minWidth: 150,
                sortable: true,
                headerName: 'Passout year',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.passoutYear}>
                    {row?.passoutYear ? row?.passoutYear : '-'}
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
                field: 'deptName',
                minWidth: 200,
                sortable: true,
                headerName: 'Department',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.department?.deptName}>
                    {row?.department?.deptName ? row?.department?.deptName : '-'}
                </Typography>
            },
            {
                field: 'degreeName',
                minWidth: 200,
                sortable: true,
                headerName: 'Degree',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.degree?.degreeName}>
                    {row?.degree?.degreeName ? row?.degree?.degreeName : '-'}
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
                field: 'Actions',
                flex: 0,
                minWidth: 50,
                sortable: true,
                headerName: 'Actions',
                renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
                    <IconButton size="small" color="primary" variant="outlined" onClick={() => navigate(`/clg-users/${id}/${row?.userSeqId}`)} >
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

export default TableCollegeUser
