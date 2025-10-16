import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Translations from "src/layouts/components/Translations";
import PageHeader from "src/@core/components/page-header";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import TableCollegeUser from "src/views/tables/TableCollegeUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "src/hooks/useAuth";

const CollegeUser = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    console.log("id", id)
    const [loading, setLoading] = useState(false);
    const [collegeUserData, setCollegeUserData] = useState([])

    const { rolePremission, isMasterAdmin } = useAuth()

    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        };

        axiosInstance
            .get(ApiEndPoints.COLLEGE.get_college_users(id), { params })
            .then((response) => {
                setCollegeUserData(response?.data?.data?.users);
                setTotalCount(response?.data?.data?.totalUsers)
                console.log("college_List response--------------------", response);
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
        });
    }, [currentPage, pageSize, search])


    return (
        <>
            <Grid container spacing={4} className="match-height">
                <PageHeader
                    title={

                        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <IconButton onClick={() => navigate(-1)}>
                                <ArrowBackIcon color="primary" />
                            </IconButton>
                            <Typography variant="h5" fontWeight={700} color="primary" ml={1}>
                                College User
                            </Typography>
                        </Box>
                    }

                />
                <Grid item xs={12}>
                    <Card>
                        {/* <Box
                            sx={{
                                p: 5,
                                pb: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box></Box>
                        </Box> */}
                        <Box>
                            <Box sx={{ p: 5 }}>
                                <TableCollegeUser
                                    search={search}
                                    loading={loading}
                                    rows={collegeUserData}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    rolePremission={rolePremission}
                                    isMasterAdmin={isMasterAdmin}
                                />
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

        </>
    )
}
export default CollegeUser