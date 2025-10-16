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

import TableCompany from "src/views/tables/TableCompany";
import DialogCompany from "src/views/dialog/DialogCompany";

const Company = () => {
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
    // Testimonials for Company
    const [companyData, setCompanyData] = useState([])
    const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
    const [companyDialogMode, setCompanyDialogMode] = useState("add");
    const [companyToEdit, setCompanyToEdit] = useState(null);

    const toggleCompanyDialog = (e, mode = 'add', companyToEdit = null) => {
        setCompanyDialogOpen(prev => !prev);
        setCompanyDialogMode(mode);
        setCompanyToEdit(companyToEdit);
    };

    const fetchCompanyData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        };

        axiosInstance
            .get(ApiEndPoints.COMPANY.get, { params })
            .then((response) => {
                setCompanyData(response?.data?.data);
                setTotalCount(response.data.pagination.total)
                console.log("Company_List response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        fetchCompanyData({
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
                            <Translations text="Company" />
                        </Typography>
                    }
                    action={
                        <Button variant="contained"
                            onClick={toggleCompanyDialog}
                        >
                            Add Company
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
                                <TableCompany
                                    search={search}
                                    loading={loading}
                                    rows={companyData}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    toggleEdit={toggleCompanyDialog}
                                    toggleStatus={toggleChangeStatusDialog}
                                // toggleDelete={toggleChangeStatusDialog}
                                />
                            </Box>

                        </Box>
                    </Card>

                </Grid>
            </Grid>


            <DialogCompany
                mode={companyDialogMode}
                open={companyDialogOpen}
                toggle={toggleCompanyDialog}
                dataToEdit={companyToEdit}
                onSuccess={() => {
                    fetchCompanyData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />

            <DialogStatus
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="company"
                onSuccess={() => {
                    fetchCompanyData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />
        </>
    )
}
export default Company