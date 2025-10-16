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
import { useNavigate, useParams } from "react-router-dom";
import TableCountry from "src/views/tables/TableCountry";
import DialogCountry from "src/views/dialog/DialogCountry";
import DialogStatus from "src/views/dialog/DialogStatus";
import TableState from "src/views/tables/TableState";
import DialogState from "src/views/dialog/DialogState";
import DialogCity from "src/views/dialog/DialogCity";
import TableCity from "src/views/tables/TableCity";

const State = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const { id } = useParams()
    console.log("id", id)
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

    // Testimonials for state
    const [stateData, setStateData] = useState([])
    const [stateDialogOpen, setStateDialogOpen] = useState(false);
    const [stateDialogMode, setStateDialogMode] = useState("add");
    const [stateToEdit, setStateToEdit] = useState(null);

    const toggleStateDialog = (e, mode = 'add', stateToEdit = null) => {
        setStateDialogOpen(prev => !prev);
        setStateDialogMode(mode);
        setStateToEdit(stateToEdit);
    };

    const fetchStateData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search, countryId }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search,
            countryId: id
        };

        axiosInstance
            .get(ApiEndPoints.STATE.get, { params })
            .then((response) => {
                setStateData(response?.data?.data);
                setTotalCount(response.data.pagination.total)
                console.log("state_List response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        fetchStateData({
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
                            <Translations text="State" />
                        </Typography>
                    }
                    action={
                        <Button variant="contained"
                            onClick={toggleStateDialog}
                        >
                            Add State
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
                            <TableState
                                search={search}
                                loading={loading}
                                rows={stateData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={toggleStateDialog}
                                toggleStatus={toggleChangeStatusDialog}
                            // toggleDelete={toggleChangeStatusDialog}
                            />
                        </Box>

                    </Card>
                </Grid>
            </Grid>

            <DialogState
                mode={stateDialogMode}
                open={stateDialogOpen}
                toggle={toggleStateDialog}
                dataToEdit={stateToEdit}
                id={id}
                onSuccess={() => {
                    fetchStateData({
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
                type="state"
                onSuccess={() => {
                    fetchStateData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />
        </>
    )
}
export default State