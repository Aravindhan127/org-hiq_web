import { Avatar, Box, Card, CardContent, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FallbackSpinner from "src/@core/components/spinner";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const OrgUserDetail = () => {
    const params = useParams();
    const { id, userSeqId } = params;
    const navigate = useNavigate()
    const [orgData, setOrgData] = useState('');
    const [loading, setLoading] = useState('');
    const [statusFormDialogOpen, setStatusFormDialogOpen] = useState(false);
    const [statusToEdit, setStatusToEdit] = useState(null);

    const fetchData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints.COLLEGE.get_college_user_detail(id, userSeqId))
            .then(response => {
                setOrgData(response?.data?.data?.userData);
            })
            .catch(error => {
                console.log("error", error)
                // Handle error
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchData();
    }, [userSeqId]);

    console.log("orgData", orgData)
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

                    <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon color="primary" />
                        </IconButton>
                        <Typography variant="h5" fontWeight={700} color="primary" ml={1}>
                            Organization User's Details
                        </Typography>
                    </Box>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "User Name:", value: `${orgData?.appUser?.firstName || ''} ${orgData?.appUser?.lastName || ''}`.trim() },
                                {
                                    label: "DOB:",
                                    value: orgData?.appUser?.dateOfBirth ? moment(orgData?.appUser?.dateOfBirth).format('L') : "N/A"
                                },

                                { label: "Official Email:", value: orgData?.appUser?.userEmail, isEmail: true },
                                { label: "Country:", value: orgData?.appUser?.country },
                                { label: "State:", value: orgData?.appUser?.state },
                                { label: "City:", value: orgData?.appUser?.city },
                                { label: "Contact Number:", value: orgData?.appUser?.mobileNumber },
                                { label: "Whatsapp Number:", value: orgData?.appUser?.whatsApp },
                                { label: "Status", value: orgData?.status },
                                ...(orgData?.status === "rejected"
                                    ? [{ label: "Rejected Reason", value: orgData?.rejectReason }]
                                    : []),
                                {
                                    label: "Profile:",
                                    value: orgData?.appUser?.linkedinProfileUrl || orgData?.profileUrl ? (
                                        <Avatar src={orgData?.appUser?.linkedinProfileUrl || orgData?.profileUrl} />
                                    ) : "N/A"
                                },
                                { label: "Profile Bio:", value: orgData?.profileBio },
                                { label: "Job Title", value: orgData?.job },
                                { label: "Company Name", value: orgData?.company },
                                {
                                    label: "Company Url",
                                    value: orgData?.companyUrl ? (
                                        <Link to={orgData.companyUrl} target="_blank" rel="noopener noreferrer" style={{ textTransform: "lowercase" }}>
                                            {orgData.companyUrl}
                                        </Link>
                                    ) : "N/A"
                                },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}</TableCell>
                                    <TableCell
                                        sx={{
                                            width: "50%",
                                            textTransform: item.isEmail ? "lowercase" : "capitalize" // Prevent capitalization for email
                                        }}
                                    >
                                        {item.value || "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>

                </CardContent>
            </Card>

        </>
    );
};
export default OrgUserDetail;
