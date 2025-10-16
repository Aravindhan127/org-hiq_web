import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { axiosInstance } from 'src/network/adapter';
import { ApiEndPoints } from 'src/network/endpoints';
import { toastError } from 'src/utils/utils';
import { useAuth } from 'src/hooks/useAuth';
import icon from "../../../src/assets/images/Icon.svg"
import approved from "../../../src/assets/images/apporved.svg"
import pending from "../../../src/assets/images/pending.svg"
import rejected from "../../../src/assets/images/rejected.svg"

function DashboardPage() {
    const { rolePremission } = useAuth()
    const initialData = [
        {
            stats: 0,
            title: 'Organization',
            link: '/organizations',
            type: 'organizationCounts',
            pendingStats: 0,
            rejectedStats: 0,
            acceptedStats: 0,
            pendingType: 'orgPendingCount',
            acceptedType: 'orgApprovedCount',
            rejectedType: 'orgRejectedCount',
            requiredPermission: 'org.list',
        },
        {
            stats: 0,
            title: 'College',
            link: '/college',
            type: 'collegeCounts',
            pendingStats: 0,
            rejectedStats: 0,
            acceptedStats: 0,
            pendingType: 'colgPendingCount',
            acceptedType: 'colgApprovedCount',
            rejectedType: 'colgRejectedCount',
            requiredPermission: 'college.list',
        },
        {
            stats: 0,
            title: 'Admin',
            link: '/admin',
            type: 'activeAdmin',
            activeAdminType: 'activeAdmin',
            inactiveType: 'inactiveAdmin',
            inactiveStats: 0,
            requiredPermission: 'subadmin.list',
        },
        // {
        //     stats: {
        //         pending: 0,
        //         rejected: 0,
        //         approved: 0,
        //     },
        //     title: 'Organization',
        //     link: '/organizations',
        //     type: 'organizationCounts',
        //     requiredPermission: 'org.list',
        // },
        // {
        //     stats: {
        //         pending: 0,
        //         rejected: 0,
        //         approved: 0,
        //     },
        //     title: 'College',
        //     link: '/college',
        //     type: 'collegeCounts',
        //     requiredPermission: 'college.list',
        // },

        // {
        //     stats: '0',
        //     title: 'College',
        //     link: '/college',
        //     type: 'activeColleges',
        //     requiredPermission: 'college.list',
        // },
        // {
        //     stats: '0',
        //     title: 'Admin',
        //     link: '/admin',
        //     type: 'activeAdmin',
        //     requiredPermission: 'subadmin.list',
        // },
        // {
        //     stats: {
        //         pending: 0,
        //         accepted: 0,
        //         expired: 0,
        //     },
        //     title: 'Payment Status',
        //     // link: '/college',
        //     type: 'paymentCounts',
        //     // requiredPermission: 'college.list',
        // },
    ];

    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(initialData);
    const [orderStats, setOrderStats] = useState([]);

    const fetchData = () => {
        setLoading(true);

        axiosInstance
            .get(ApiEndPoints.DASHBOARD.count)
            .then((response) => {
                const data = response.data.data;

                setStats(prevStats =>
                    prevStats.map(item => {
                        if (item.title === 'Admin') {
                            // Special handling for Admin card
                            const activeCount = data[item.activeAdminType] || 0;
                            const inactiveCount = data[item.inactiveType] || 0;
                            return {
                                ...item,
                                stats: activeCount + inactiveCount,
                                activeStats: activeCount,
                                inactiveStats: inactiveCount
                            };
                        } else {
                            // Original handling for other cards
                            const approved = data[item.acceptedType] || 0;
                            const pending = data[item.pendingType] || 0;
                            const rejected = data[item.rejectedType] || 0;
                            const total = approved + pending + rejected;

                            return {
                                ...item,
                                stats: total,
                                pendingStats: pending,
                                acceptedStats: approved,
                                rejectedStats: rejected
                            };
                        }
                    })
                );
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);
    console.log("stats", stats)

    return (
        <>
            <Grid container spacing={6}>
                {stats.map((item, index) => (
                    <Grid key={index} item xs={12} sm={4} lg={4} xl={3}>
                        <Box
                            component={Link}
                            to={item.link}
                            key={index}
                            variant="body1"
                            sx={{ textDecoration: 'none' }}
                        >
                            <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 0px rgba(0, 0, 0, 0.03)' }}>
                                <CardContent>
                                    <Typography variant='fm-p3' fontWeight={600} color={'#272727'}>
                                        {item.title}
                                    </Typography>
                                    {/* <Box>
                                            {item.type === 'collegeUsers' &&
                                                <Typography variant="body1">
                                                    Student: {item.stats.studentUserCount} | Faculty: {item.stats.facultyUserCount} | Alumni: {item.stats.alumUserCount}
                                                </Typography>
                                            }
                                        </Box> */}
                                    {/* {item.type === 'orgUser' || item.type === 'collegeUsers' ? ( */}
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                                        <Typography variant='fm-h5' fontWeight={700} color={'#202224'}>
                                            {item.stats}
                                        </Typography>
                                        <img src={icon} />
                                    </Box>
                                    {/* ) : null} */}

                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}>
                                        {item.title === 'Admin' ? (
                                            <>
                                                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <img src={approved} style={{ height: "30px", width: "30px" }} />
                                                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Active</Typography>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}> {item?.activeStats}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <img src={pending} style={{ height: "30px", width: "30px" }} />
                                                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Pending</Typography>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>0</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <img src={rejected} style={{ height: "30px", width: "30px" }} />
                                                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Inactive</Typography>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>{item?.inactiveStats}</Typography>
                                                    </Box>
                                                </Box>
                                            </>
                                        ) : (
                                            <>
                                                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <img src={approved} style={{ height: "30px", width: "30px" }} />
                                                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Approved</Typography>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}> {item?.acceptedStats}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <img src={pending} style={{ height: "30px", width: "30px" }} />
                                                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Pending</Typography>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>{item?.pendingStats}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <img src={rejected} style={{ height: "30px", width: "30px" }} />
                                                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Rejected</Typography>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>{item?.rejectedStats}</Typography>
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                    </Box>


                                </CardContent>
                            </Card>

                        </Box>

                    </Grid>
                ))}



                {/* {stats.map((item, index) => {
                    const hasPermission = rolePremission?.permissions?.some(
                        (permission) => permission.permissionName === item.requiredPermission
                    );

                    return (
                        <Grid key={index} item xs={12} sm={3}>
                            {hasPermission ? (
                                <Typography
                                    component={Link}
                                    to={item.link}
                                    key={index}
                                    variant="body1"
                                    sx={{ textDecoration: 'none' }}
                                >
                                    <Card
                                        sx={{
                                            overflow: 'visible',
                                            position: 'relative',
                                            border: '2px solid #E51E79',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography sx={{ mb: 10, fontWeight: 600 }}>
                                                {item.title}
                                            </Typography>
                                            <Box>
                                                {typeof item.stats === 'object' ? (
                                                    <Typography variant="body1">
                                                        {Object.entries(item.stats)
                                                            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                                                            .join(' | ')}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="h5">{item.stats}</Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Typography>
                            ) : (
                                <Card
                                    sx={{
                                        overflow: 'visible',
                                        position: 'relative',
                                        border: '2px solid #E51E79',
                                    }}
                                >
                                    <CardContent>
                                        <Typography sx={{ mb: 10, fontWeight: 600 }}>
                                            {item.title}
                                        </Typography>
                                        <Box>
                                            {typeof item.stats === 'object' ? (
                                                <Typography variant="body1">
                                                    {Object.entries(item.stats)
                                                        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                                                        .join(' | ')}
                                                </Typography>
                                            ) : (
                                                <Typography variant="h5">{item.stats}</Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>
                    );
                })} */}
            </Grid>
        </>
    );
}

export default DashboardPage;
