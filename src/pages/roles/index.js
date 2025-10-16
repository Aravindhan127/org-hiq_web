import * as React from 'react'
import Box from '@mui/material/Box'
import { Button, Card, Grid, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Translations from 'src/layouts/components/Translations'
import { useNavigate } from 'react-router-dom'
import { ApiEndPoints } from 'src/network/endpoints'
import { axiosInstance } from 'src/network/adapter'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { useState, useRef } from 'react'
import { toastError, toastSuccess } from 'src/utils/utils'
import { useEffect } from 'react'
import { useCallback } from 'react'
// import DialogDeleteConfirmation from 'src/views/dialog/DialogDeleteConfirmation'
import PageHeader from 'src/@core/components/page-header'
import TableRoles from 'src/views/tables/TableRoles'
import { useAuth } from 'src/hooks/useAuth'

function UserRolesPage() {
    const navigate = useNavigate()
    const searchTimeoutRef = useRef()
    const { rolePremission, isMasterAdmin } = useAuth()
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
    const [userRoles, setUserRole] = useState([])
    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setUserToDelete(dataToDelete)
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true)
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        }
        axiosInstance
            .get(ApiEndPoints.ROLES.getRoles, { params })
            .then(response => {
                console.log("res", response.data.data)
                setUserRole(response.data.data)
                setTotalCount(response.data.data.totalCount)
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
            <Grid container spacing={4}>
                <PageHeader
                    title={
                        <Typography variant='h5'>
                            <Translations text='Roles' />
                        </Typography>
                    }

                    action={
                        (rolePremission?.permissions?.some(
                            item => item.permissionName === 'role.create'
                        ) || isMasterAdmin === true) ? (
                            <Button variant='contained' onClick={() => navigate('/add-roles')}>
                                <Translations text='Add Roles' />
                            </Button>
                        ) : null
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
                                justifyContent: "flex-end",
                            }}
                        >
                            <Box>  <TextField type='search' size='small' placeholder='Search' onChange={handleSearchChange} /></Box>
                        </Box> */}
                        <Box sx={{ p: 5 }}>
                            <TableRoles
                                search={search}
                                loading={loading}
                                rows={userRoles}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                // toggleEdit={toggleDialog}
                                toggleDelete={toggleConfirmationDialog}
                                rolePremission={rolePremission}
                                isMasterAdmin={isMasterAdmin}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            {/* <DialogPermission open={isOpen} toggle={toggleDialog} mode={DialogMode} /> */}
        </>
    )
}
export default UserRolesPage