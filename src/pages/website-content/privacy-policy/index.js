import { Button, Grid, Typography } from "@mui/material"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import PageHeader from "src/@core/components/page-header"
import Translations from "src/layouts/components/Translations"
import { useEffect, useState } from "react"
import { axiosInstance } from "src/network/adapter"
import { ApiEndPoints } from "src/network/endpoints"
import toast from "react-hot-toast"
import DialogPrivacyPolicy from "src/views/dialog/DialogPrivacyPolicy"
import FallbackSpinner from "src/@core/components/spinner"
import { useAuth } from "src/hooks/useAuth"


const PrivacyPolicyPage = () => {
    const { rolePremission, isMasterAdmin } = useAuth()
    const [openpivacypolicyDialog, setOpenPrivacypolicyDialog] = useState(false)
    const [privacypolicyDataToEdit, setPrivacypolicyDataToEdit] = useState(null)
    const togglePrivacypolicyDialog = (e, dataToEdit) => {
        setOpenPrivacypolicyDialog(prev => !prev)
        setPrivacypolicyDataToEdit(dataToEdit)
    }
    const [loading, setLoading] = useState(false)

    const [privacypolicy, setPrivacypolicy] = useState([])
    const getPrivacypolicy = () => {
        setLoading(true)
        axiosInstance
            .get(`${ApiEndPoints.DOCUMENT.document('privacy')}`)
            .then(response => {
                setPrivacypolicy(response.data.data || '')

            })
            .catch(error => {
                toast.error(error.response.data.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        getPrivacypolicy()
    }, [])

    if (loading) {
        return <FallbackSpinner />
    }
    return <>
        <Grid container spacing={4} className="match-height">
            <PageHeader
                title={
                    <Typography variant="h5">
                        <Translations text="Privacy Policy" />
                    </Typography>
                }

                action={
                    (rolePremission?.permissions?.some(
                        item => item.permissionName === 'document.edit'
                    ) || isMasterAdmin === true) ? (
                        <Button variant="contained" onClick={e => togglePrivacypolicyDialog(e, privacypolicy)}>
                            Edit Privacy Policy
                        </Button>
                    ) : null
                }
            />
            <Grid item xs={12}>
                <Card>
                    <Box sx={{ p: 5, pb: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                            <div className="blog_____content" dangerouslySetInnerHTML={{
                                __html: (privacypolicy.description)
                            }} />
                        </Typography>
                    </Box>
                </Card>
            </Grid>
        </Grid>
        <DialogPrivacyPolicy
            open={openpivacypolicyDialog}
            toggle={togglePrivacypolicyDialog}
            dataToEdit={privacypolicyDataToEdit}
            onSuccess={() => getPrivacypolicy()}
        />
    </>
}

export default PrivacyPolicyPage