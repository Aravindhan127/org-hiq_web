import { Avatar, Box, Button, Card, CardContent, Divider, Grid, IconButton, Table, TableBody, Tooltip, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FallbackSpinner from "src/@core/components/spinner";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const OrganizationDetail = () => {
    const params = useParams()
    const navigate = useNavigate();
    const { orgId } = params
    console.log("orgId", orgId)
    const [orgData, setorgData] = useState('')
    const [loading, setLoading] = useState('')

    const fetchData = () => {
        setLoading(true)
        axiosInstance
            .get(ApiEndPoints.ORGANIZATION.getById(orgId))
            .then(response => {
                console.log("response", response.data.data)
                setorgData(response?.data?.data?.organisation)
            })
            .catch(error => {
                //toastError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        fetchData()
    }, [orgId])

    const handleViewDetails = (orgId) => {
        navigate(`/org-users/${orgId}`);
    };
    if (loading) return <FallbackSpinner />;
    console.log("orgData", orgData)
    function formatLabel(value) {
        if (!value) return "N/A";
        return value
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
    }
    return (
        <>
            <Card
                sx={{
                    width: "100%",
                    maxWidth: "100%",
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 2,
                    mb: 3
                }}
            >
                <CardContent sx={{ width: "100%" }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
                        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <IconButton onClick={() => navigate(-1)}>
                                <ArrowBackIcon color="primary" />
                            </IconButton>
                            <Typography variant="h5" fontWeight={700} color="primary" ml={1}>
                                Basic Organization Details
                            </Typography>
                        </Box>
                        <Button size="medium" color="primary" variant="contained" onClick={() => handleViewDetails(orgData.orgId)}>
                            View User
                        </Button>
                    </Box>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Organization Name:", value: orgData?.orgName === null ? 'N/A' : orgData?.orgName },
                                { label: "Website URL:", value: orgData?.websiteUrl === null ? 'N/A' : orgData?.websiteUrl },
                                { label: "Official Email:", value: orgData?.orgEmail === null ? 'N/A' : orgData?.orgEmail },
                                {
                                    label: "Contact Number:",
                                    value: orgData?.contactNumber
                                        ? `+${orgData.contactNumber}`
                                        : 'N/A'
                                },
                                { label: "Street Address:", value: orgData?.streetAddress === null ? 'N/A' : orgData?.streetAddress },
                                { label: "Country:", value: orgData?.country?.name === null ? 'N/A' : orgData?.country },
                                { label: "State:", value: orgData?.state?.name === null ? 'N/A' : orgData?.state },
                                { label: "City:", value: orgData?.city?.name === null ? 'N/A' : orgData?.city },
                                { label: "Postal Code:", value: orgData?.postalCode === null ? 'N/A' : orgData?.postalCode },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value === null || item.value === undefined || item.value === '' ? 'N/A' : item.value}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, width: "50%" }}>Logo:</TableCell>
                                <TableCell sx={{ width: "50%" }}>
                                    <Avatar
                                        src={orgData?.logo}
                                        sx={{ width: 100, height: 100, borderRadius: 2 }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Administrator / Point of Contact
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                {
                                    label: "Primary Contact Name",
                                    value: orgData?.adminFirstName && orgData?.adminLastName
                                        ? `${orgData.adminFirstName} ${orgData.adminLastName}`
                                        : ""
                                },
                                {
                                    label: "Phone Number:",
                                    value: orgData?.adminPhone
                                        ? `+${orgData?.adminPhone}`
                                        : 'N/A'
                                },

                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value === null || item.value === undefined || item.value === '' ? 'N/A' : item.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Alumni Information
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Year Established", value: orgData?.yearEstablished === null ? 'N/A' : orgData?.yearEstablished },
                                { label: "Total Alumni Count", value: orgData?.totalAlumniCount === null ? 'N/A' : orgData?.totalAlumniCount },
                                { label: "Active Alumni Associations", value: orgData?.isActiveAlumniAssociations === true ? "true" : "false" },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value === null || item.value === undefined || item.value === '' ? 'N/A' : item.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Engagement Features Setup
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Preferred Features", value: orgData?.preferredFeatures }
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{formatLabel(item.value === null || item.value === undefined || item.value === '' ? 'N/A' : item.value)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Integration Options
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Integration Options", value: orgData?.integrationNeeds }
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{formatLabel(item.value === null || item.value === undefined || item.value === '' ? 'N/A' : item.value)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> */}

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Customization Options
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>

                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, width: "50%" }}>Custom Branding:</TableCell>
                                <TableCell sx={{ width: "50%" }}>
                                    <Avatar
                                        src={orgData?.brandingFile}
                                        sx={{ width: 100, height: 100, borderRadius: 2 }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Social Media Links
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Linkedin Url", value: orgData?.linkedInUrl },
                                { label: "Instagram Url", value: orgData?.instagramUrl },
                                { label: "Twitter Url", value: orgData?.twitterUrl },
                                { label: "Facebook Url", value: orgData?.facebookUrl },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>
                                        {item.value === null || item.value === 'null' ? 'N/A' : <Link to={item.value}>{item.value}</Link>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Additional Comments/Requirements
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Additional Comments/Requirements", value: orgData?.additionalComments },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value === null || item.value === 'null' ? "N/A" : item?.value}</TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Status
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                // { label: "Full Name", value: orgData?.confirmationName },
                                // { label: "Email", value: orgData?.confirmationEmail },
                                // { label: "Phone Number", value: orgData?.confirmationPhone },
                                {
                                    label: "Status",
                                    value: orgData?.isApproved === true
                                        ? "Accepted"
                                        : orgData?.isRejected === true
                                            ? "Rejected"
                                            : "Pending"
                                }
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value || "N/A"}</TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>


                </CardContent>
            </Card>
        </>
    )

}
export default OrganizationDetail
