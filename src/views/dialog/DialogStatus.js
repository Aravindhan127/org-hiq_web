import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, MenuItem, Radio, RadioGroup, Select } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";

const validationSchema = yup.object().shape({
    status: yup.string().required("Required"),
})

const DialogStatus = (props) => {

    const { open, toggle, dataToEdit, onSuccess, type } = props;
    console.log("type", type)
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const status = dataToEdit?.isActive === true ? 'active' : 'inactive'
    console.log("dataToEdit", dataToEdit)
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            status: status,
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            reset({
                status: status || '',
            })
            setDialogTitle("Update Status")
        }
    }, [dataToEdit, open, reset])

    const onSubmit = (data) => {
        let payload = {};
        if (type === 'country') {
            payload.countryRecordId = dataToEdit?.id;
        } else if (type === 'state') {
            payload.stateRecordId = dataToEdit?.id;
        } else if (type === 'city') {
            payload.cityRecordId = dataToEdit?.id;
        } else if (type === 'college') {
            payload.collegeId = dataToEdit?.orgId;
        } else if (type === 'org') {
            payload.organisationId = dataToEdit?.orgId;
        } else if (type === 'company') {
            payload.companyId = dataToEdit?.id;
        } else if (type === 'jobs') {
            payload.jobId = dataToEdit?.id;
        } else if (type === 'degree') {
            payload.degreeId = dataToEdit?.id;
        } else if (type === 'department') {
            payload.departmentId = dataToEdit?.id;
        } else if (type === 'admin') {
            payload.orgAdminId = dataToEdit?.id;
        }

        setLoading(true);
        const apiInstance =
            type === 'country' ? axiosInstance.post(ApiEndPoints.COUNTRY.active_deactive, payload) :
                type === 'state' ? axiosInstance.post(ApiEndPoints.STATE.active_deactive, payload) :
                    type === 'city' ? axiosInstance.post(ApiEndPoints.CITY.active_deactive, payload) :
                        type === 'college' ? axiosInstance.post(ApiEndPoints.COLLEGE.active_deactive, payload) :
                            type === 'org' ? axiosInstance.post(ApiEndPoints.ORGANIZATION.active_deactive, payload) :
                                type === 'company' ? axiosInstance.post(ApiEndPoints.COMPANY.active_deactive, payload) :
                                    type === 'jobs' ? axiosInstance.post(ApiEndPoints.JOBS.active_deactive, payload) :
                                        type === 'degree' ? axiosInstance.post(ApiEndPoints.DEGREE.active_deactive, payload) :
                                            type === 'department' ? axiosInstance.post(ApiEndPoints.DEPARTMENT.active_deactive, payload) :
                                                type === 'admin' ? axiosInstance.post(ApiEndPoints.ADMIN.active_deactive(dataToEdit?.appAdminId), payload) :
                                                    null; // Add a fallback in case `type` doesn't match


        apiInstance
            .then((response) => response.data)
            .then((response) => {
                onSuccess();
                toastSuccess(response.message);
                toggle();
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return <>
        <Dialog open={open} onClose={toggle} fullWidth maxWidth='sm' scroll="paper">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>{dialogTitle}</Box>
                <IconButton
                    aria-label="close"
                    onClick={toggle}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                <form id="status-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='status' error={Boolean(errors.status)}>Status</FormLabel>
                                <Controller
                                    name='status'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            id='status'
                                            defaultValue={status}
                                            value={value}
                                            onChange={onChange}
                                            sx={{ bgcolor: '#F7FBFF' }}
                                            error={Boolean(errors.status)}
                                            helperText={errors.status ? errors.status.message : ''}
                                        >
                                            <MenuItem value={'active'}>Active</MenuItem>
                                            <MenuItem value={'inactive'}>Inactive</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.status && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.status.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    size="large"
                    type="submit"
                    form="status-form"
                    variant="contained"
                    loading={loading}
                >
                    Submit
                </LoadingButton>
                <Button size="large" variant="outlined" onClick={toggle}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    </>
}

export default DialogStatus