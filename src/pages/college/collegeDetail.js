import { Avatar, Box, Button, Card, CardContent, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FallbackSpinner from "src/@core/components/spinner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
const CollegeDetail = () => {
    const params = useParams();
    const { collegeId } = params;
    const navigate = useNavigate();
    const [collegeData, setCollegeData] = useState('');
    const [loading, setLoading] = useState('');
    const [statusFormDialogOpen, setStatusFormDialogOpen] = useState(false);
    const [statusToEdit, setStatusToEdit] = useState(null);

    const fetchData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints.COLLEGE.getById(collegeId))
            .then(response => {
                setCollegeData(response?.data?.data?.collegeData);
            })
            .catch(error => {
                // Handle error
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchData();
    }, [collegeId]);


    const handleViewDetails = (orgId) => {
        navigate(`/clg-users/${orgId}`);
    };

    console.log("collegedata", collegeData)
    if (loading) return <FallbackSpinner />;

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
                                Basic College Details
                            </Typography>
                        </Box>
                        <Button size="medium" color="primary" variant="contained" onClick={() => handleViewDetails(collegeData.orgId)}>
                            View User
                        </Button>
                    </Box>

                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "College Name:", value: collegeData?.orgName === 'null' ? 'N/A' : collegeData?.orgName },
                                { label: "Website URL:", value: collegeData?.websiteUrl === 'null' ? 'N/A' : collegeData?.websiteUrl },
                                { label: "Official Email:", value: collegeData?.orgEmail === 'null' ? 'N/A' : collegeData?.orgEmail },
                                {
                                    label: "Contact Number:",
                                    value: collegeData?.contactNumber
                                        ? `+${collegeData.contactNumber}`
                                        : 'N/A'
                                },
                                { label: "Street Address:", value: collegeData?.streetAddress === 'null' ? 'N/A' : collegeData?.streetAddress },
                                { label: "Country:", value: collegeData?.country?.name === 'null' ? 'N/A' : collegeData?.country },
                                { label: "State:", value: collegeData?.state?.name === 'null' ? 'N/A' : collegeData?.state },
                                { label: "City:", value: collegeData?.city?.name === 'null' ? 'N/A' : collegeData?.city },
                                { label: "Postal Code:", value: collegeData?.postalCode === 'undefined' ? 'N/A' : collegeData?.postalCode },
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
                                        src={collegeData?.logo}
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
                                    value: collegeData?.adminFirstName && collegeData?.adminLastName
                                        ? `${collegeData.adminFirstName} ${collegeData.adminLastName}`
                                        : ""
                                },
                                {
                                    label: "Phone Number:",
                                    value: collegeData?.adminPhone
                                        ? `+${collegeData?.adminPhone}`
                                        : 'N/A'
                                },
                                // { label: "Designation / Role", value: collegeData?.administratorRole },
                                // { label: "Email Address", value: collegeData?.administratorEmail },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value === null || item.value === undefined || item.value === '' ? 'N/A' : item.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Program and Alumni Information
                    </Typography>

                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                {
                                    label: "Number of Programs Offered",
                                    value: (
                                        <Typography variant="fm-p3" sx={{ fontWeight: 400, textTransform: "capitalize" }}>
                                            {collegeData?.collegePrograms?.length || 0}
                                        </Typography>
                                    ),
                                },
                                { label: "Total Alumni Count", value: collegeData?.totalAlumniCount === 'null' ? 'N/A' : collegeData?.totalAlumniCount },
                                { label: "Year Established", value: collegeData?.yearEstablished === "null" ? "N/A" : collegeData?.yearEstablished },
                                { label: "Active Alumni Associations", value: collegeData?.isActiveAlumniAssociations === true ? "true" : "false" },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>
                                        {item.value === null || item.value === undefined || item.value === "" ? "N/A" : item.value}
                                    </TableCell>
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
                                { label: "Preferred Features", value: collegeData?.preferredFeatures }
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
                                { label: " Integration Options", value: collegeData?.integrationNeeds }
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
                            {/* {[
                                { label: "Theme Preferences", value: collegeData?.themePreferences }
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value || "N/A"}</TableCell>
                                </TableRow>
                            ))} */}

                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, width: "50%" }}>Custom Branding:</TableCell>
                                <TableCell sx={{ width: "50%" }}>
                                    <Avatar
                                        src={collegeData?.brandingFile}
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
                                { label: "Linkedin Url", value: collegeData?.linkedInUrl },
                                { label: "Instagram Url", value: collegeData?.instagramUrl },
                                { label: "Twitter Url", value: collegeData?.twitterUrl },
                                { label: "Facebook Url", value: collegeData?.facebookUrl },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>
                                        {item.value === null || item.value === null ? 'N/A' : <Link to={item.value}>{item.value}</Link>}
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
                                { label: "Additional Comments/Requirements", value: collegeData?.additionalComments },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value === null || item.value === undefined || item.value === '' ? 'N/A' : item.value}</TableCell>
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
                                // { label: "Full Name", value: collegeData?.confirmationName },
                                // { label: "Email", value: collegeData?.confirmationEmail },
                                // { label: "Phone Number", value: collegeData?.confirmationPhone },
                                {
                                    label: "Status",
                                    value: collegeData?.isApproved === true
                                        ? "Accepted"
                                        : collegeData?.isRejected === true
                                            ? "Rejected"
                                            : "Pending"
                                }

                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value === null || item.value === undefined || item.value === '' ? 'N/A' : item.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                </CardContent>
            </Card>

        </>
    );
};
export default CollegeDetail;
