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
import TableNotification from "src/views/tables/TableNotification"
import axios from 'axios';
import authConfig from '../../configs/auth'
const NotificationPage = () => {

    const searchTimeoutRef = useRef();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const [notificationData, setNotificationData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);
    const type = window.localStorage.getItem("loginType");
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

    // const fetchData = async () => {
    //     setLoading(true);
    //     let params = {
    //         page: currentPage,
    //     };
    //     try {
    //         const headers = {
    //             Authorization: `Bearer ${storedToken}`,
    //         };
    //         let response;
    //         if (type === "organisation") {
    //             response = await axios.get(ApiEndPoints.ORGANIZATION_USER.get_notification, { params, headers });
    //         } else {
    //             response = await axios.get(ApiEndPoints.COLLEGE_USER.get_notification, { params, headers });
    //         }
    //         setNotificationData(response?.data?.data);
    //     } catch (error) {
    //         toastError(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // useEffect(() => {
    //     fetchData();
    // }, []);

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search, status }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search,
            status: status
        };

        axiosInstance
            .get(ApiEndPoints.NOTIFICATION.list, { params })
            .then((response) => {
                setNotificationData(response?.data?.data)
                setTotalCount(response?.data?.total)
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
        });
    }, [currentPage]);

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
                        <Translations text="Notification" />
                    </Typography>
                }
            // action={
            //     <Button variant="contained" onClick={toggleMedicalSpecializationFormDialog}>
            //         Add Medical Specialization
            //     </Button>
            // }
            />
            <Grid item xs={12}>
                <Card>
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
                        <TableNotification
                            search={search}
                            loading={loading}
                            rows={notificationData}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid >


    </>
}

export default NotificationPage