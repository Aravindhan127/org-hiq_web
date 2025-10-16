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

import DialogDepartment from "src/views/dialog/DialogDepartment";
import TableDepartment from "src/views/tables/TableDepartment";

const Department = () => {
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
    // Testimonials for Department
    const [departmentData, setDepartmentData] = useState([])
    const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
    const [departmentDialogMode, setDepartmentDialogMode] = useState("add");
    const [departmentToEdit, setDepartmentToEdit] = useState(null);

    const toggleDepartmentDialog = (e, mode = 'add', DepartmentToEdit = null) => {
        setDepartmentDialogOpen(prev => !prev);
        setDepartmentDialogMode(mode);
        setDepartmentToEdit(DepartmentToEdit);
    };

    const fetchDepartmentData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        };

        axiosInstance
            .get(ApiEndPoints.DEPARTMENT.get, { params })
            .then((response) => {
                setDepartmentData(response?.data?.data);
                setTotalCount(response.data.pagination.total)
                console.log("Department_List response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        fetchDepartmentData({
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
                            <Translations text="Department" />
                        </Typography>
                    }
                    action={
                        <Button variant="contained"
                            onClick={toggleDepartmentDialog}
                        >
                            Add Department
                        </Button>
                    }
                />
                <Grid item xs={12}>
                    <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 0px rgba(0, 0, 0, 0.03)' }}>
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
                                <TableDepartment
                                    search={search}
                                    loading={loading}
                                    rows={departmentData}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    toggleEdit={toggleDepartmentDialog}
                                    toggleStatus={toggleChangeStatusDialog}
                                // toggleDelete={toggleChangeStatusDialog}
                                />
                            </Box>

                        </Box>
                    </Card>

                </Grid>
            </Grid>


            <DialogDepartment
                mode={departmentDialogMode}
                open={departmentDialogOpen}
                toggle={toggleDepartmentDialog}
                dataToEdit={departmentToEdit}
                onSuccess={() => {
                    fetchDepartmentData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />

            <DialogStatus
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="department"
                onSuccess={() => {
                    fetchDepartmentData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />
        </>
    )
}
export default Department