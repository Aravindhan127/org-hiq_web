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
import DialogStatus from "src/views/dialog/DialogStatus";

import DialogJobs from "src/views/dialog/DialogJobs";
import TableJobs from "src/views/tables/TableJobs";

const Jobs = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    // status dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
        setStatusDialogOpen((prev) => !prev);
        setStatusToUpdate(statusToUpdate);
    };
    // Testimonials for Jobs
    const [jobsData, setJobsData] = useState([])
    const [jobsDialogOpen, setJobsDialogOpen] = useState(false);
    const [jobsDialogMode, setJobsDialogMode] = useState("add");
    const [jobsToEdit, setJobsToEdit] = useState(null);

    const toggleJobsDialog = (e, mode = 'add', JobsToEdit = null) => {
        setJobsDialogOpen(prev => !prev);
        setJobsDialogMode(mode);
        setJobsToEdit(JobsToEdit);
    };

    const fetchJobsData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        };

        axiosInstance
            .get(ApiEndPoints.JOBS.get, { params })
            .then((response) => {
                setJobsData(response?.data?.data);
                setTotalCount(response.data.pagination.total)
                console.log("Jobs_List response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        fetchJobsData({
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
                            <Translations text="Jobs" />
                        </Typography>
                    }
                    action={
                        <Button variant="contained"
                            onClick={toggleJobsDialog}
                        >
                            Add Jobs
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
                        </Box>
                        <Box>
                            <Box sx={{ p: 5 }}>
                                <TableJobs
                                    search={search}
                                    loading={loading}
                                    rows={jobsData}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    toggleEdit={toggleJobsDialog}
                                    toggleStatus={toggleChangeStatusDialog}
                                // toggleDelete={toggleChangeStatusDialog}
                                />
                            </Box>

                        </Box>
                    </Card>

                </Grid>
            </Grid>


            <DialogJobs
                mode={jobsDialogMode}
                open={jobsDialogOpen}
                toggle={toggleJobsDialog}
                dataToEdit={jobsToEdit}
                onSuccess={() => {
                    fetchJobsData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />

            <DialogStatus
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="jobs"
                onSuccess={() => {
                    fetchJobsData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />
        </>
    )
}
export default Jobs