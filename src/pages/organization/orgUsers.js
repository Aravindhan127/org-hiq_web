import { useEffect, useState, useRef, useCallback, Tooltip } from "react";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Translations from "src/layouts/components/Translations";
import PageHeader from "src/@core/components/page-header";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { toastError, toastSuccess } from "src/utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "src/hooks/useAuth";
import TableOrgUser from "src/views/tables/TableOrgUser";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";

const OrganizationUsers = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    console.log("id", id)
    const [loading, setLoading] = useState(false);
    const [orgUserData, setOrgUserData] = useState([])

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
                setOrgUserData(response?.data?.data?.users);
                setTotalCount(response?.data?.data?.totalUsers)
                console.log("org_List response--------------------", response);
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
                                Organization User
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
                                <TableOrgUser
                                    search={search}
                                    loading={loading}
                                    rows={orgUserData}
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
export default OrganizationUsers