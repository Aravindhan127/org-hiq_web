import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Translations from "src/layouts/components/Translations";
import PageHeader from "src/@core/components/page-header";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints, VELTECH_BASE_URL } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import DialogConfirmation from "src/views/dialog/DialogConfirmation";
import { useNavigate } from "react-router-dom";
import TableOrg from "src/views/tables/TableOrg";
import DialogOrg from "src/views/dialog/DialogOrg";
import DialogStatus from "src/views/dialog/DialogStatus";
import { useAuth } from "src/hooks/useAuth";
import DialogRejectReason from "src/views/dialog/DialogRejectReason";
const Organization = () => {
    const navigate = useNavigate()
    const { rolePremission, isMasterAdmin } = useAuth()
    const searchTimeoutRef = useRef()
    const [loading, setLoading] = useState(false)
    const [orgData, setOrgData] = useState([])

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [orgToDelete, setOrgToDelete] = useState(null)

    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)

    const toggleConfirmationDialog = (e, orgToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setOrgToDelete(orgToDelete)
    }
    // Testimonials
    const [orgFormDialogOpen, setOrgFormDialogOpen] = useState(false)
    const [orgFormDialogMode, setOrgFormDialogMode] = useState('add')
    const [orgToEdit, setOrgToEdit] = useState(null)

    const toggleOrgDialog = (e, mode = 'add', orgToEdit = null) => {
        setOrgFormDialogOpen(prev => !prev)
        setOrgFormDialogMode(mode)
        setOrgToEdit(orgToEdit)
    }

    // status dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [statusToUpdate, setStatusToUpdate] = useState(null)

    const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
        setStatusDialogOpen(prev => !prev)
        if (statusToUpdate?.isApproved) {
            setStatusToUpdate(statusToUpdate)
        }
    }

    //reject reason dialog
    const [rejectOrgDialogOpen, setRejectOrgDialogOpen] = useState(false)
    const [rejectOrgId, setRejectOrgId] = useState(null)

    const toggleRejectOrgReq = id => {
        setRejectOrgDialogOpen(prev => !prev)
        setRejectOrgId(id)
    }

    const addeditOrg = (e, mode = 'add', dataToEdit) => {
        navigate('/organizations-form', { state: { mode, dataToEdit } })
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true)
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        }
        axiosInstance
            .get(ApiEndPoints.ORGANIZATION.getList, { params })
            .then(response => {
                setOrgData(response?.data?.data?.organisationsData)
                setTotalCount(response?.data?.data?.total)
                console.log('org_List response--------------------', response)
            })
            .catch(error => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search
        })
    }, [currentPage, pageSize, search])

    console.log('rolePremissionsss', rolePremission?.permissions)

    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }

    const handleAction = (type, id) => {
        if (type === 'approve') {
            const payload = { orgId: id }

            setLoading(true)
            axiosInstance
                .post(ApiEndPoints.ORGANIZATION.accept, payload)
                .then(response => {
                    toastSuccess(response.data.message)
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                        search: search
                    })
                })
                .catch(error => {
                    toastError(error.message || 'Something went wrong')
                })
                .finally(() => setLoading(false))
        } else if (type === 'reject') {
            // Open the dialog and set the ID for rejection
            setRejectOrgId(id)
            setRejectOrgDialogOpen(true)
        }
    }

    const onConfirmDeleteorgDetail = useCallback(
        e => {
            e?.preventDefault()
            setConfirmationDialogLoading(true)
            axiosInstance
                .delete(ApiEndPoints.org.delete_by_id(orgToDelete?.id))
                .then(response => response.data)
                .then(response => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                        search: search
                    })
                    toggleConfirmationDialog()
                    toastSuccess(response.message)
                    console.log('response', response)
                })
                .catch(error => {
                    toastError(error)
                })
                .finally(() => {
                    setConfirmationDialogLoading(false)
                })
        },
        [currentPage, orgToDelete, pageSize, search]
    )
    return (
        <>
            <Grid container spacing={4} className='match-height'>
                <PageHeader
                    title={
                        <Typography variant='h5'>
                            <Translations text='Organization' />
                        </Typography>
                    }
                    action={
                        rolePremission?.permissions?.some(item => item.permissionName === 'org.create') ||
                            isMasterAdmin === true ? (
                            <Button variant='contained' onClick={e => addeditOrg(e, 'add')}>
                                Add Organization
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
                            <TableOrg
                                search={search}
                                loading={loading}
                                rows={orgData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={addeditOrg}
                                toggleDelete={toggleConfirmationDialog}
                                toggleApproveReject={handleAction}
                                toggleStatus={toggleChangeStatusDialog}
                                rolePremission={rolePremission}
                                isMasterAdmin={isMasterAdmin}
                                devBaseUrl={VELTECH_BASE_URL}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <DialogOrg
                mode={orgFormDialogMode}
                open={orgFormDialogOpen}
                toggle={toggleOrgDialog}
                dataToEdit={orgToEdit}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize
                    })
                }}
            />
            <DialogStatus
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type='org'
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize
                    })
                }}
            />

            <DialogRejectReason
                open={rejectOrgDialogOpen}
                toggle={toggleRejectOrgReq}
                id={rejectOrgId}
                // type={"org"}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                        search: search
                    })
                }}
            />
            {/* <DialogConfirmation
                loading={confirmationDialogLoading}
                title="Delete org"
                subtitle="Are you sure you want to delete this org?"
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDeleteorgDetail}
            /> */}
        </>
    )
}
export default Organization
