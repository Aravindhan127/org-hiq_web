import { useEffect, useState, useRef } from "react"
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import PageHeader from "src/@core/components/page-header"
import Translations from "src/layouts/components/Translations"
import { axiosInstance } from "src/network/adapter"
import { ApiEndPoints } from "src/network/endpoints"
import { DefaultPaginationSettings } from "src/constants/general.const"
import { toastError } from "src/utils/utils"
import TableReferFriend from "src/views/tables/TableReferFriend"
import DialogReferFriend from "src/views/dialog/DialogReferFriend"

const ReferFriendPage = () => {

    const searchTimeoutRef = useRef();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const [notificationData, setNotificationData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    const [referFormDialogOpen, setReferFormDialogOpen] = useState(false);
    const [referFormDialogMode, setReferFormDialogMode] = useState("add");
    const [referToEdit, setReferToEdit] = useState(null);

    const toggleReferFormDialog = (e, mode = "add", referToEdit = null) => {
        setReferFormDialogOpen(prev => !prev);
        setReferFormDialogMode(mode);
        setReferToEdit(referToEdit);
    }


    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search, status }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search,
            status: status
        };

        axiosInstance
            .get(ApiEndPoints.REFER_FRIEND.list, { params })
            .then((response) => {
                setNotificationData(response.data.data.referFriendSection)
                setTotalCount(response.data.data.totalCount)
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
            status: status
        });
    }, [currentPage, pageSize, search, status]);

    const handleSearchChange = (e) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value);
        }, 500)
    }

    return <>
        <Grid container spacing={4} className="match-height">
            <PageHeader
                title={
                    <Typography variant="h5">
                        <Translations text="Refer a Friend" />
                    </Typography>
                }
            // action={
            //     <Button variant="contained" onClick={toggleMedicalSpecializationFormDialog}>
            //         Add Medical Specialization
            //     </Button>
            // }
            />
            <Grid item xs={12}>
                <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 0px rgba(0, 0, 0, 0.03)' }}>
                    <Box sx={{ p: 5, pb: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box></Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                            {/* <Select
                                size='small'
                                defaultValue={' '}
                                sx={{ bgcolor: '#F7FBFF' }}
                                onChange={e => {
                                    const selectedValue = e.target.value
                                    setStatus(selectedValue === 'All' ? '' : selectedValue)
                                }}
                            >
                                <MenuItem disabled value={' '}>
                                    <em>Status</em>
                                </MenuItem>
                                <MenuItem value={'All'}>All</MenuItem>
                                <MenuItem value={'pending'}>Pending</MenuItem>
                                <MenuItem value={'onTheway'}>OnTheway</MenuItem>
                                <MenuItem value={'delivered'}>Delivered</MenuItem>
                            </Select> */}
                            <TextField
                                type="search"
                                size='small'
                                placeholder='Search'
                                onChange={handleSearchChange}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ p: 5 }}>
                        <TableReferFriend
                            search={search}
                            loading={loading}
                            rows={notificationData}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                            toggleEdit={toggleReferFormDialog}
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid >

        <DialogReferFriend
            mode={referFormDialogMode}
            open={referFormDialogOpen}
            toggle={toggleReferFormDialog}
            dataToEdit={referToEdit}
            onSuccess={() => {
                fetchData({
                    currentPage: currentPage,
                    pageSize: pageSize,
                });
            }}
        />
    </>
}

export default ReferFriendPage