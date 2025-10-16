import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'

function TableCompany({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleStatus,
    toggleDelete,
}) {
    const statusColors = {
        Active: '#8bc34a',
        Inactive: '#FFB400',
    }
    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))
    const navigate = useNavigate();
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions' && field !== 'status') {
            navigate(`/state/${row?.id}`);
        }

    };
    return <CustomDataGrid
        // handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={rows}
        columns={[
            {
                field: 'id',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'Id',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.id}>
                    {row.id}
                </Typography>
            },
            {
                field: 'name',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.name}>
                    {row?.name}
                </Typography>
            },

            {
                field: 'status',
                minWidth: 180,
                sortable: false,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row.isActive === true ? 'Active' : 'Inactive'} onClick={(e) => toggleStatus(e, row)} />
            },
            {
                field: 'Actions',
                flex: 0,
                minWidth: 170,
                sortable: false,
                headerName: 'Actions',
                renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
                    <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleEdit(e, "edit", row)}>
                        <EditIcon />
                    </IconButton>
                    {/* <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
                        <DeleteIcon />
                    </IconButton> */}
                </Box>
            }
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableCompany
