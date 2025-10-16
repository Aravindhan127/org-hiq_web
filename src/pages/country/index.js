import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Translations from "src/layouts/components/Translations";
import PageHeader from "src/@core/components/page-header";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import DialogConfirmation from "src/views/dialog/DialogConfirmation";
import { useNavigate } from "react-router-dom";
import TableCountry from "src/views/tables/TableCountry";
import DialogCountry from "src/views/dialog/DialogCountry";
import DialogStatus from "src/views/dialog/DialogStatus";
import TableState from "src/views/tables/TableState";
import DialogState from "src/views/dialog/DialogState";
import DialogCity from "src/views/dialog/DialogCity";
import TableCity from "src/views/tables/TableCity";

const Country = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    // status dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
        setStatusDialogOpen((prev) => !prev);
        setStatusToUpdate(statusToUpdate);
    };
    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);


    // Testimonials for country
    const [countryData, setCountryData] = useState([])
    const [countryDialogOpen, setCountryDialogOpen] = useState(false);
    const [countryDialogMode, setCountryDialogMode] = useState("add");
    const [countryToEdit, setCountryToEdit] = useState(null);

    const toggleCountryDialog = (e, mode = 'add', countryToEdit = null) => {
        setCountryDialogOpen(prev => !prev);
        setCountryDialogMode(mode);
        setCountryToEdit(countryToEdit);
    };

    const fetchCountryData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        };

        axiosInstance
            .get(ApiEndPoints.COUNTRY.get, { params })
            .then((response) => {
                setCountryData(response?.data?.data);
                setTotalCount(response.data.pagination.total)
                console.log("country_List response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };


    useEffect(() => {
        fetchCountryData({
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
                        <Typography variant="h5">
                            <Translations text="Country" />
                        </Typography>
                    }
                    action={
                        <Button variant="contained"
                            onClick={toggleCountryDialog}
                        >
                            Add Country
                        </Button>
                    }
                />
                <Grid item xs={12}>
                    <Card>
                        <Box
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
                        </Box>
                        <Box>
                            <Box sx={{ p: 5 }}>
                                <TableCountry
                                    search={search}
                                    loading={loading}
                                    rows={countryData}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    toggleEdit={toggleCountryDialog}
                                    toggleStatus={toggleChangeStatusDialog}
                                // toggleDelete={toggleChangeStatusDialog}
                                />
                            </Box>

                        </Box>
                    </Card>

                </Grid>
            </Grid>

            {/* <Grid container spacing={4} className="match-height" mt={4}>
                <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="City" />
                        </Typography>
                    }
                    action={
                        <Button variant="contained"
                            onClick={toggleCountryDialog}
                        >
                            Add City
                        </Button>
                    }
                />
                <Grid item xs={12}>

                    <Card sx={{ mt: 2 }}>
                        <Box
                            sx={{
                                p: 5,
                                pb: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                        </Box>
                        <Box sx={{ p: 5 }}>
                            <TableCity
                                search={search}
                                loading={loading}
                                rows={countryData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={toggleCountryDialog}
                                toggleStatus={toggleChangeStatusDialog}
                            // toggleDelete={toggleChangeStatusDialog}
                            />
                        </Box>

                    </Card>
                </Grid>
            </Grid> */}

            <DialogCountry
                mode={countryDialogMode}
                open={countryDialogOpen}
                toggle={toggleCountryDialog}
                dataToEdit={countryToEdit}
                onSuccess={() => {
                    fetchCountryData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />


            {/* <DialogCity
                mode={countryDialogMode}
                open={countryDialogOpen}
                toggle={toggleCountryDialog}
                dataToEdit={countryToEdit}
                onSuccess={() => {
                    fetchCountryData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            /> */}

            <DialogStatus
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="country"
                onSuccess={() => {
                    fetchCountryData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />
        </>
    )
}
export default Country