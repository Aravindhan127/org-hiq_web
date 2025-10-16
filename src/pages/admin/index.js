import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
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
import TableAdmin from "src/views/tables/TableAdmin";
import DialogAdmin from "src/views/dialog/DialogAdmin";
import { useAuth } from "src/hooks/useAuth";


const Admin = () => {
    const navigate = useNavigate()
    const searchTimeoutRef = useRef()
    const { rolePremission, isMasterAdmin } = useAuth()
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


    // Testimonials for Admin
    const [adminData, setAdminData] = useState([])
    const [adminDialogOpen, setAdminDialogOpen] = useState(false);
    const [adminDialogMode, setAdminDialogMode] = useState("add");
    const [adminToEdit, setAdminToEdit] = useState(null);

    const [role, setRole] = useState([])
    const toggleAdminDialog = (e, mode = 'add', adminToEdit = null) => {
        setAdminDialogOpen(prev => !prev);
        setAdminDialogMode(mode);
        setAdminToEdit(adminToEdit);
    };

    const fetchAdminData = () => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search,
        }
        axiosInstance
            .get(ApiEndPoints.ADMIN.get, { params })
            .then((response) => {
                setAdminData(response?.data?.admins);
                setTotalCount(response.data.total)
                console.log("ADMIN response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    const fetchRoleData = () => {
        setLoading(true);

        axiosInstance
            .get(ApiEndPoints.ADMIN.getRoles)
            .then((response) => {
                setRole(response?.data?.data.map((item, index) => item));
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };
    useEffect(() => {
        fetchAdminData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
        });
    }, [currentPage, search])

    useEffect(() => {
        fetchRoleData();
    }, [])

    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }


    return (
        <>
            <Grid container spacing={4} className="match-height">
                <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="Admin" />
                        </Typography>
                    }

                    action={
                        (rolePremission?.permissions?.some(
                            item => item.permissionName === 'subadmin.create'
                        ) || isMasterAdmin === true) ? (
                            <Button
                                variant="contained"
                                onClick={toggleAdminDialog}
                            >
                                Add Admin
                            </Button>
                        ) : null
                    }

                />
                <Grid item xs={12}>
                    <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 0px rgba(0, 0, 0, 0.03)' }}>
                        {/* <Box
                            sx={{
                                p: 5,
                                pb: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Box>  <TextField type='search' size='small' placeholder='Search' onChange={handleSearchChange} /></Box>
                        </Box> */}
                        <Box sx={{ p: 5, mt: 5 }}>
                            <TableAdmin
                                search={search}
                                loading={loading}
                                rows={adminData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={toggleAdminDialog}
                                toggleStatus={toggleChangeStatusDialog}
                                rolePremission={rolePremission}
                                isMasterAdmin={isMasterAdmin}
                            // toggleDelete={toggleChangeStatusDialog}
                            />
                        </Box>

                    </Card>
                </Grid>
            </Grid>

            <DialogAdmin
                open={adminDialogOpen}
                toggle={toggleAdminDialog}
                mode={adminDialogMode}
                dataToEdit={adminToEdit}
                role={role}
                onSuccess={() => {
                    fetchAdminData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />

            <DialogStatus
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="admin"
                onSuccess={() => {
                    fetchAdminData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />
        </>
    )
}
export default Admin