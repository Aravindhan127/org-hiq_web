import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'

function TableNotification({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleDelete,
}) {
    const statusColors = {
        onTheway: '#FFB400',
        delivered: '#66bb6a',
        pending: '#FFB400',
    }
    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))
    const navigate = useNavigate();
    // const handleCellClick = ({ row, field }) => {
    //     if (field !== 'Actions') {
    //         let driverId = row._id;
    //         navigate(`/driver/${driverId}`);
    //     }
    //     // You can add more logic for other fields if needed
    // };
    const mappedRows = rows?.map((row, index) => ({
        ...row,
        id: row.notificationId,
    }));
    return <CustomDataGrid
        //handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        columns={[
            {
                field: 'orgName',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.orgDetail.orgName}>
                    {row.orgDetail.orgName}
                </Typography>
            },
            {
                field: 'orgType',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'Org Type',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.orgDetail?.orgType}>
                    {row?.orgDetail?.orgType}
                </Typography>
            },

        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableNotification
