import { Avatar, Box, Card, CardContent, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FallbackSpinner from "src/@core/components/spinner";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";

const CollegeUserDetail = () => {
    const params = useParams();
    const { id, userSeqId } = params;
    const [collegeUserData, setCollegeUserData] = useState('');
    const [loading, setLoading] = useState('');
    const [statusFormDialogOpen, setStatusFormDialogOpen] = useState(false);
    const [statusToEdit, setStatusToEdit] = useState(null);

    const fetchData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints.COLLEGE.get_college_user_detail(id, userSeqId))
            .then(response => {
                setCollegeUserData(response?.data?.data?.userData);
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

    console.log("collegeUserData", collegeUserData)
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

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        College User's Details
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "User Name:", value: `${collegeUserData?.appUser?.firstName || ''} ${collegeUserData?.appUser?.lastName || ''}`.trim() },
                                { label: "DOB:", value: moment(collegeUserData?.appUser?.dateOfBirth).format('L') },
                                { label: "Official Email:", value: collegeUserData?.appUser?.userEmail, isEmail: true },
                                { label: "Country:", value: collegeUserData?.appUser?.country },
                                { label: "State:", value: collegeUserData?.appUser?.state },
                                { label: "City:", value: collegeUserData?.appUser?.city },
                                { label: "Contact Number:", value: collegeUserData?.appUser?.mobileNumber },
                                { label: "Whatsapp Number:", value: collegeUserData?.appUser?.whatsApp },
                                { label: "Passout Year:", value: collegeUserData?.passoutYear },
                                { label: "Status", value: collegeUserData?.status },
                                ...(collegeUserData?.status === "rejected"
                                    ? [{ label: "Rejected Reason", value: collegeUserData?.rejectReason }]
                                    : []),

                                { label: "User Type:", value: collegeUserData?.userType },
                                { label: "Student Id:", value: collegeUserData?.studentId },

                                {
                                    label: "Profile:",
                                    value: collegeUserData?.appUser?.linkedinProfileUrl || collegeUserData?.profileUrl ? (
                                        <Avatar src={collegeUserData?.appUser?.linkedinProfileUrl || collegeUserData?.profileUrl} />
                                    ) : "N/A"
                                },
                                { label: "Profile Bio:", value: collegeUserData?.profileBio },
                                {
                                    label: "LinkedIn Url",
                                    value: collegeUserData?.linkedinUrl ? (
                                        <Link to={collegeUserData.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ textTransform: "lowercase" }}>
                                            {collegeUserData.linkedinUrl}
                                        </Link>
                                    ) : "N/A"
                                },
                                {
                                    label: "Current Status:",
                                    value: collegeUserData?.currentStatus
                                        ?.replace(/([A-Z])/g, " $1") // Add space before uppercase letters
                                        .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
                                }
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

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Department & Degree
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Department", value: collegeUserData?.department?.deptName },
                                { label: "Degree", value: collegeUserData?.degree?.degreeName },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%", textTransform: "capitalize" }}>{item.value || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Education Information
                    </Typography>

                    {collegeUserData?.educations?.length > 0 ? (
                        <Table sx={{ width: "100%", mt: 1 }}>
                            <TableBody>
                                {collegeUserData.educations.map((education, eduIndex) => (
                                    <>
                                        {[
                                            { label: "Institution Name", value: education.institutionName },
                                            { label: "Department", value: education.department },
                                            { label: "Degree", value: education.degree },
                                            { label: "Passout Year", value: education.passoutYear },
                                            { label: "Country", value: education.country },
                                            { label: "State", value: education.state },
                                            { label: "City", value: education.city },
                                        ].map((item, index) => (
                                            <TableRow key={`${eduIndex}-${index}`}>
                                                <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                                <TableCell sx={{ width: "50%", textTransform: "capitalize" }}>{item.value || "N/A"}</TableCell>
                                            </TableRow>
                                        ))}
                                        {eduIndex !== collegeUserData.educations.length - 1 && (
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Divider sx={{ my: 1 }} />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Table sx={{ width: "100%", mt: 1 }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}> Education Information</TableCell>
                                    <TableCell sx={{ width: "50%" }}>N/A</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                    )}

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Employment Details
                    </Typography>

                    {collegeUserData?.employments?.length > 0 ? (
                        <Table sx={{ width: "100%", mt: 1 }}>
                            <TableBody>
                                {collegeUserData.employments.map((employment, empIndex) => (
                                    <>
                                        {[
                                            { label: "Company Name", value: employment.companyName },
                                            { label: "Job Title", value: employment.jobTitle },
                                            { label: "Start Date", value: employment.startDate },
                                            { label: "End Date", value: employment.endDate },
                                            { label: "Country", value: employment.country },
                                            { label: "State", value: employment.state },
                                            { label: "City", value: employment.city },
                                        ].map((item, index) => (
                                            <TableRow key={`${empIndex}-${index}`}>
                                                <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                                <TableCell sx={{ width: "50%", textTransform: "capitalize" }}>{item.value || "N/A"}</TableCell>
                                            </TableRow>
                                        ))}
                                        {empIndex !== collegeUserData.educations.length - 1 && (
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Divider sx={{ my: 1 }} />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Table sx={{ width: "100%", mt: 1 }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>Employment Details</TableCell>
                                    <TableCell sx={{ width: "50%" }}>N/A</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}



                </CardContent>
            </Card>

        </>
    );
};
export default CollegeUserDetail;
