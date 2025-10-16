import { useEffect, useRef, useState, useCallback } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import TableCountry from "src/views/tables/TableCountry";
import DialogCountry from "src/views/dialog/DialogCountry";
import DialogStatus from "src/views/dialog/DialogStatus";
import TableCity from "src/views/tables/TableCity";
import DialogCity from "src/views/dialog/DialogCity";


const City = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const { id } = useParams()
    const { cid } = useParams()
    console.log("id", id)
    console.log("cid", cid)
    // Confirmation
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
        setStatusDialogOpen((prev) => !prev);
        setStatusToUpdate(statusToUpdate);
    };

    // Testimonials for city
    const [cityData, setCityData] = useState([])
    const [cityDialogOpen, setCityDialogOpen] = useState(false);
    const [cityDialogMode, setCityDialogMode] = useState("add");
    const [cityToEdit, setCityToEdit] = useState(null);

    const togglecityDialog = (e, mode = 'add', cityToEdit = null) => {
        setCityDialogOpen(prev => !prev);
        setCityDialogMode(mode);
        setCityToEdit(cityToEdit);
    };

    const fetchcityData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search,
            stateId: id,
            countryId: cid
        };

        axiosInstance
            .get(ApiEndPoints.CITY.get, { params })
            .then((response) => {
                setCityData(response?.data?.data);
                setTotalCount(response.data.pagination.total)
                console.log("city_List response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        fetchcityData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
        });
    }, [currentPage, pageSize, search])


    return (
        <>


            <Grid container spacing={4} className="match-height" mt={4}>
                <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="city" />
                        </Typography>
                    }
                    action={
                        <Button variant="contained"
                            onClick={togglecityDialog}
                        >
                            Add city
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
                                rows={cityData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={togglecityDialog}
                                toggleStatus={toggleChangeStatusDialog}
                                toggleDelete={toggleChangeStatusDialog}
                            />
                        </Box>

                    </Card>
                </Grid>
            </Grid>



            <DialogCity
                mode={cityDialogMode}
                open={cityDialogOpen}
                toggle={togglecityDialog}
                dataToEdit={cityToEdit}
                id={id}
                cid={cid}
                onSuccess={() => {
                    fetchcityData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />


            <DialogStatus
                // loading={statusDialogLoading}
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="city"
                onSuccess={() => {
                    fetchcityData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />
        </>
    )
}
export default City