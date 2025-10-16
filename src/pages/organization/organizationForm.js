import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, IconButton, InputAdornment, ListItemText, MenuItem, Radio, RadioGroup, Select, TextField, Typography, useTheme } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CleaveNumberInput, CleaveNumberInputPhone, CleaveNoDecimalNumberInput, TextOnlyInput } from "src/@core/components/cleave-components";
import CustomFileUploads from "src/views/common/CustomFileUploads";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { useAuth } from "src/hooks/useAuth";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

const validationSchema = yup.object().shape({
    orgName: yup.string().trim().required('Name is required'),
    orgEmail: yup
        .string()
        .required("Email is required")
        .max(50, "The email should have at most 50 characters")
        .matches(
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Email address must be a valid address"
        ),
    adminFirstName: yup.string().trim().required('Administrator First Name is required'),
    adminLastName: yup.string().trim().required('Administrator Last Name is required'),
    adminPhone: yup.string()
        .required('Contact number is required').max(15, 'Contact Number at most 10 characters'),
    streetAddress: yup.string().trim().nullable().notRequired(),
    postalCode: yup
        .number()
        .nullable()
        .notRequired(),
    websiteUrl: yup.string().trim().nullable().notRequired().url('Enter a valid URL'),
    city: yup.string().trim().nullable().notRequired(),
    state: yup.string().trim().nullable().notRequired(),
    country: yup.string().trim().nullable().notRequired(),
    contactNumber: yup
        .string()
        .trim()
        .notRequired()
        .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number.") // E.164 format
        .min(10, "Phone number must be at least 10 digits.")
        .max(15, "Phone number must be at most 15 digits."),
    yearEstablished: yup.string().trim().nullable().notRequired(),
    isExternalDbExist: yup.boolean().required(),
    dbHostName: yup
        .string()
        .trim()
        .when("isExternalDbExist", {
            is: true,
            then: schema => schema.required("Hostname is required"),
            otherwise: schema => schema.notRequired(),
        }),
    databaseName: yup
        .string()
        .trim()
        .when("isExternalDbExist", {
            is: true,
            then: schema => schema.required("DB Name is required"),
            otherwise: schema => schema.notRequired(),
        }),
    dbUserName: yup
        .string()
        .trim()
        .when("isExternalDbExist", {
            is: true,
            then: schema => schema.required("DB Username is required"),
            otherwise: schema => schema.notRequired(),
        }),
    dbPassword: yup
        .string()
        .trim()
        .when("isExternalDbExist", {
            is: true,
            then: schema => schema.required("DB Password is required"),
            otherwise: schema => schema.notRequired(),
        }),
    // preferredFeatures: yup
    //     .array()
    //     .of(yup.string().trim().required('Feature is required'))
    //     .min(1, 'At least one feature is required')
    //     .required('Preferred features are required'),
    // integrationNeeds: yup
    //     .array()
    //     .of(yup.string().trim().required('Feature is required'))
    //     .min(1, 'At least one feature is required')
    //     .required('This field is required'),
    // isDataPrivacyAgreement: yup.boolean().oneOf([true], "Data Privacy Agreement must be accepted"),
    // isTermsAndConditions: yup.boolean().oneOf([true], "Terms and Conditions must be accepted"),
    // social_media_links: yup.object().shape({
    //     linkedin: yup
    //         .string()
    //         .url('Enter a valid URL')
    //         .required('URL is required'),
    //     twitter: yup
    //         .string()
    //         .url('Enter a valid URL')
    //         .required('URL is required'),
    //     facebook: yup
    //         .string()
    //         .url('Enter a valid URL')
    //         .required('URL is required'),
    //     instagram: yup
    //         .string()
    //         .url('Enter a valid URL')
    //         .required('URL is required'),
    // }),
    // additionalComments: yup.string().trim().required('Additional Comment is required'),
    // submittedBy: yup.string().trim().required('Confirmation Name is required'),
    // confirmationPhone: yup.string()
    //     .required('Confirmation Number is required').max(15, 'Confirmation Number at most 10 characters'),
    // confirmationEmail: yup
    //     .string()
    //     .required("Email is required")
    //     .max(50, "The email should have at most 50 characters")
    //     .matches(
    //         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    //         "Email address must be a valid address"
    //     ),
    // logo: yup.mixed().required("Logo is required")
    //     .test("fileSize", "Logo is required", (value) => {
    //         if (typeof value === "string") return true;
    //         return !value || value.size <= 1024 * 1024 * 3; // 5MB
    //     })
    //     .test("fileType", "Unsupported file format", (value) => {
    //         if (typeof value === "string") return true;
    //         return !value || /image\/(jpeg|jpg|png|pdf)/.test(value.type);
    //     }),
    // brandingFile: yup.mixed().required("File is required")
    //     .test("fileSize", "File is required", (value) => {
    //         if (typeof value === "string") return true;
    //         return !value || value.size <= 1024 * 1024 * 3; // 5MB
    //     })
    //     .test("fileType", "Unsupported file format", (value) => {
    //         if (typeof value === "string") return true;
    //         return !value || /image\/(jpeg|jpg|png|pdf)/.test(value.type);
    //     }),
})

const Organization = () => {
    const { state } = useLocation()
    const navigate = useNavigate();
    const { dataToEdit, mode } = state || {}
    console.log("datatoedit", dataToEdit)
    const { theme } = useTheme();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [stateLoading, setStateLoading] = useState(false);
    const [countryLoading, setCountryLoading] = useState(false)
    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [selectedcountry, setSelectedcountry] = useState('')
    const [cityLoading, setCityLoading] = useState(false); // State for city loading
    const [selectedCountry, setselectedCountry] = useState('')

    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        watch,
        clearErrors,
        formState: { errors }
    } = useForm({
        defaultValues: {
            orgName: null,
            orgEmail: null,
            streetAddress: null,
            postalCode: null,
            websiteUrl: null,
            contactNumber: null,
            city: null,
            state: null,
            country: null,
            adminFirstName: null,
            adminLastName: null,
            adminPhone: null,
            yearEstablished: '',
            isActiveAlumniAssociations: false,
            currentPlatform: '',
            preferredFeatures: [],
            integrationNeeds: [],
            isDataPrivacyAgreement: false,
            isTermsAndConditions: false,
            social_media_links: {
                linkedin: null,
                twitter: null,
                facebook: null,
                instagram: null,
            },
            additionalComments: null,
            submittedBy: null,
            confirmationPhone: null,
            confirmationEmail: null,
            logo: null,
            brandingFile: null,
            isExternalDbExist: false, // New field for external database existence
            dbHostName: null, // New field for external database hostname
            dbUserName: null, // New field for external database name
            dbPassword: null, // New field for external database name
            databaseName: null, // New field for external database name
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    const isExternalDbExist = watch("isExternalDbExist");

    const fetchCountryStateCityData = () => {
        setLoading(true);
        let params = {
            listType: 'country',
        };
        axiosInstance
            .get(ApiEndPoints.COUNTRY_STATE_CITY.get, { params })
            .then((response) => {
                const countries = response.data.listData.map((item, index) => ({
                    id: index + 1, // Add unique ID for Autocomplete
                    name: item.country,
                }));
                setCountryList(countries);
                setTotalCount(response?.data?.dataCount)
                console.log("country_List response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchStateData = (countryName) => {
        console.log("my country", countryName)
        setStateLoading(true);
        let params = {
            listType: 'state',
            country: countryName,
        };
        axiosInstance
            .get(ApiEndPoints.COUNTRY_STATE_CITY.get, { params })
            .then((response) => {
                const states = response.data.listData.map((item, index) => ({
                    id: index + 1,
                    name: item.state,
                }));
                setStateList(states);
                setCityList([]);
            })
            .catch((error) => {
                console.error('Error fetching states:', error);
            })
            .finally(() => setStateLoading(false));
    };

    const fetchCityData = (stateName, countryName) => {
        setStateLoading(true);
        let params = {
            listType: 'city',
            country: countryName,
            state: stateName,
        };
        axiosInstance
            .get(ApiEndPoints.COUNTRY_STATE_CITY.get, { params })
            .then((response) => {

                const cities = response.data.listData.map((item, index) => ({
                    id: index + 1,
                    name: item.city,
                }));

                setCityList(cities);
            })
            .catch((error) => {
                console.error('Error fetching states:', error);
            })
            .finally(() => setStateLoading(false));
    };

    console.log("cities", cityList)
    useEffect(() => {
        fetchCountryStateCityData()
    }, [])

    useEffect(() => {
        if (countryList.length > 0 && dataToEdit) {
            fetchEditData();
        }
    }, [countryList]);

    const fetchEditData = async () => {
        console.log("data", dataToEdit)
        if (!dataToEdit) return;

        reset({
            orgName: dataToEdit?.orgName || null,
            orgEmail: dataToEdit?.orgEmail || null,
            streetAddress: dataToEdit?.streetAddress || null,
            postalCode: dataToEdit?.postalCode || null,
            websiteUrl: dataToEdit?.websiteUrl || null,
            contactNumber: dataToEdit?.contactNumber || null,
            country: dataToEdit?.country || null,
            state: dataToEdit?.state || null,
            city: dataToEdit?.city || null,
            adminFirstName: dataToEdit?.adminFirstName || null,
            adminLastName: dataToEdit?.adminLastName || null,
            adminPhone: dataToEdit?.adminPhone || '',
            yearEstablished: dataToEdit?.yearEstablished || null,
            isActiveAlumniAssociations: dataToEdit?.isActiveAlumniAssociations || false,

            // currentPlatform: dataToEdit?.currentPlatform === null ? '' : '',

            preferredFeatures: dataToEdit?.preferredFeatures
                ? dataToEdit.preferredFeatures.split(',') // Split the string into an array
                : [],
            integrationNeeds: dataToEdit?.integrationNeeds
                ? dataToEdit.integrationNeeds.split(',') // Split the string into an array
                : [],
            isDataPrivacyAgreement: dataToEdit?.isDataPrivacyAgreement || false,
            isTermsAndConditions: dataToEdit?.isTermsAndConditions || false,
            social_media_links: {
                linkedin: dataToEdit?.linkedInUrl || null,
                twitter: dataToEdit?.twitterUrl || null,
                facebook: dataToEdit?.facebookUrl || null,
                instagram: dataToEdit?.instagramUrl || null,
            },
            additionalComments: dataToEdit?.additionalComments || null,
            submittedBy: dataToEdit?.submittedBy || null,
            confirmationPhone: dataToEdit?.confirmationPhone || null,
            confirmationEmail: dataToEdit?.confirmationEmail || null,
            logo: dataToEdit?.logo || null,
            brandingFile: dataToEdit ? dataToEdit?.brandingFile : `${dataToEdit?.brandingFile}` || null,
            isExternalDbExist: dataToEdit?.isExternalDbExist || false,
            dbHostName: dataToEdit?.isExternalDbExist ? dataToEdit.dbHostName || null : null,
            dbUserName: dataToEdit?.isExternalDbExist ? dataToEdit.dbUserName || null : null,
            dbPassword: dataToEdit?.isExternalDbExist ? dataToEdit.dbPassword || null : null,
            databaseName: dataToEdit?.isExternalDbExist ? dataToEdit.databaseName || null : null,
        });

        if (dataToEdit?.country) {
            await fetchStateData(dataToEdit.country); // Fetch states for the selected country
        }
        if (dataToEdit?.state) {
            await fetchCityData(dataToEdit.state, dataToEdit.country); // Fetch cities for the selected state
        }
    };
    useEffect(() => {
        if (dataToEdit) {
            setValue(
                'preferredFeatures',
                dataToEdit?.preferredFeatures
                    ? dataToEdit.preferredFeatures.split(',')
                    : []
            );
            setValue(
                'integrationNeeds',
                dataToEdit?.integrationNeeds
                    ? dataToEdit.integrationNeeds.split(',')
                    : []
            );
        }
    }, [dataToEdit, setValue]);



    useEffect(() => {
        setLoading(false);
        setTitle(mode === "add" ? "Add Organization" : "Edit Organization");
        fetchEditData()

    }, [dataToEdit, mode, reset]);


    const handlePhoneChange = (value, country, field) => {
        setValue(field, value);
        clearErrors(field);
    };

    const onSubmit = async (data) => {
        console.log("data", data);
        let payload = new FormData();

        if (mode === "edit") {
            payload.append('organisationId', dataToEdit.orgId);
        }

        // Check and append only non-empty fields
        payload.append('orgName', data.orgName);
        if (mode === "add") {
            payload.append('orgEmail', data.orgEmail);
        }
        payload.append('adminFirstName', data.adminFirstName);
        payload.append('adminLastName', data.adminLastName);
        payload.append('adminPhone', data.adminPhone);
        if (data.streetAddress) payload.append('streetAddress', data.streetAddress);
        if (data.postalCode) payload.append('postalCode', data.postalCode);
        if (data.websiteUrl) payload.append('websiteUrl', data.websiteUrl);
        if (data.contactNumber) payload.append('contactNumber', data.contactNumber);
        if (data.city) payload.append('city', data.city);
        if (data.state) payload.append('state', data.state);
        if (data.country) payload.append('country', data.country);
        // if (data.currentPlatform) payload.append('currentPlatform', data.currentPlatform);
        if (data.yearEstablished) payload.append('yearEstablished', data.yearEstablished);
        if (data.isActiveAlumniAssociations) payload.append('isActiveAlumniAssociations', data.isActiveAlumniAssociations);

        // Conditionally append array fields only if not empty
        if (data.preferredFeatures?.length) payload.append('preferredFeatures', data.preferredFeatures);
        if (data.integrationNeeds?.length) payload.append('integrationNeeds', data.integrationNeeds);

        // Conditionally append boolean fields
        if (data.isDataPrivacyAgreement !== undefined) payload.append('isDataPrivacyAgreement', data.isDataPrivacyAgreement);
        if (data.isTermsAndConditions !== undefined) payload.append('isTermsAndConditions', data.isTermsAndConditions);

        // Social media links: append only if they exist
        if (data?.social_media_links?.linkedin) payload.append('linkedInUrl', data?.social_media_links?.linkedin);
        if (data?.social_media_links?.twitter) payload.append('twitterUrl', data?.social_media_links?.twitter);
        if (data?.social_media_links?.facebook) payload.append('facebookUrl', data?.social_media_links?.facebook);
        if (data?.social_media_links?.instagram) payload.append('instagramUrl', data?.social_media_links?.instagram);

        // Append other fields only if they are not empty
        if (data.additionalComments) payload.append('additionalComments', data.additionalComments);
        if (data.submittedBy) payload.append('submittedBy', data.submittedBy);

        if (data.isExternalDbExist) payload.append('isExternalDbExist', data.isExternalDbExist);
        if (data.dbHostName) payload.append('dbHostName', data.dbHostName);
        if (data.dbUserName) payload.append('dbUserName', data.dbUserName);
        if (data.dbPassword) payload.append('dbPassword', data.dbPassword);
        if (data.databaseName) payload.append('databaseName', data.databaseName);

        // Handle file uploads if files exist
        if (data.logo instanceof File) {
            payload.append('logo', data.logo); // Append the file directly
        } else if (mode === "edit" && typeof dataToEdit.logo === "string") {
            // Check if logo is a URL and fetch it as a binary file
            const response = await fetch(dataToEdit.logo);
            const blob = await response.blob();
            const file = new File([blob], "logo.png", { type: blob.type });
            payload.append('logo', file);
        }

        if (data.brandingFile instanceof File) {
            payload.append('brandingFile', data.brandingFile); // Append the file directly
        } else if (mode === "edit" && typeof dataToEdit.brandingFile === "string") {
            // Check if brandingFile is a URL and fetch it as a binary file
            const response = await fetch(dataToEdit.brandingFile);
            const blob = await response.blob();
            const file = new File([blob], "brandingFile.jpeg", { type: blob.type });
            payload.append('brandingFile', file);
        }


        // Log FormData content properly
        for (let [key, value] of payload.entries()) {
            console.log(`${key}: ${value}`);
        }

        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .post(ApiEndPoints.ORGANIZATION.edit, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.ORGANIZATION.create, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
        }

        apiInstance
            .then((response) => response.data)
            .then((response) => {
                toastSuccess(response.message);
                reset({
                    isDataPrivacyAgreement: false,
                    isTermsAndConditions: false
                });
                navigate('/organizations');
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleFormCancel = () => {
        reset()
        navigate('/organizations')
    }
    return (
        <>
            <Box sx={{ p: 3, mb: 5 }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: "primary.main" }}>{title}</Typography>
            </Box>
            <Grid container sx={{ display: "flex", flexDirection: "column", p: { xs: 2, md: 10 } }} spacing={6}>
                <form id="org-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant="fm-p1" fontWeight={600}>Basic Details</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='orgName'>Organization Name</FormLabel>
                                <Controller
                                    name="orgName"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Organization Name'
                                            onChange={onChange}
                                            id='orgName'
                                            value={value}
                                            error={Boolean(errors.orgName)}
                                        />
                                    }
                                />
                                {errors.orgName && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.orgName.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='websiteUrl'>Website Url</FormLabel>
                                <Controller
                                    name="websiteUrl"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Website Url'
                                            multiline
                                            onChange={onChange}
                                            id='websiteUrl'
                                            value={value}
                                            error={Boolean(errors.websiteUrl)}
                                        />
                                    }
                                />
                                {errors.websiteUrl && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.websiteUrl.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='orgEmail'>Email Address (Official Contact Email)</FormLabel>
                                <Controller
                                    name="orgEmail"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter email'
                                            multiline
                                            onChange={onChange}
                                            id='orgEmail'
                                            value={value}
                                            disabled={mode === "edit"}
                                            error={Boolean(errors.orgEmail)}
                                        />
                                    }
                                />
                                {errors.orgEmail && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.orgEmail.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>


                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="contactNumber">Contact Number (Office Phone)</FormLabel>
                                <Controller
                                    name="contactNumber"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <PhoneInput
                                            inputStyle={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "10px",
                                                backgroundColor: 'transparent'
                                            }}
                                            enableSearch={true}
                                            placeholder="Contact number"
                                            value={value}
                                            country={"us"} // Set default country
                                            onChange={(value, country) => {
                                                handlePhoneChange(value, country, "contactNumber");
                                            }}
                                        />
                                    )}
                                />
                                {errors.contactNumber && (
                                    <FormHelperText sx={{ color: "error.main" }}>
                                        {errors.contactNumber.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='streetAddress'>Street Address</FormLabel>
                                <Controller
                                    name="streetAddress"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Street Address'
                                            multiline
                                            onChange={onChange}
                                            id='streetAddress'
                                            value={value}
                                            error={Boolean(errors.streetAddress)}
                                        />
                                    }
                                />
                                {errors.streetAddress && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.streetAddress.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="country">Country</FormLabel>
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            defaultValue={dataToEdit?.country}
                                            options={countryList}
                                            freeSolo // Allows custom input
                                            onInputChange={(e, newInputValue) => {
                                                // Set the input as the selected value if it's not in the list
                                                if (!countryList.some(option => option.name === newInputValue)) {
                                                    onChange(newInputValue); // Set custom input
                                                    setselectedCountry(newInputValue);
                                                }
                                            }}
                                            onChange={(e, newValue) => {
                                                console.log("Selected Country:", newValue);
                                                if (newValue && typeof newValue === 'object') {
                                                    onChange(newValue.name); // Pass country name
                                                    fetchStateData(newValue.name); // Fetch states by country name
                                                    setselectedCountry(newValue.name);
                                                }
                                            }}
                                            value={countryList.find(option => option.name === value) || value || null}
                                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select Country"
                                                    error={Boolean(errors.country)}
                                                />
                                            )}
                                            loading={countryLoading}
                                        />
                                    )}
                                />
                                {errors.country && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="state">State/Province</FormLabel>
                                <Controller
                                    name="state"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            defaultValue={dataToEdit?.state}
                                            options={stateList}
                                            freeSolo // Allows custom input
                                            onInputChange={(e, newInputValue) => {
                                                if (!stateList.some(option => option.name === newInputValue)) {
                                                    onChange(newInputValue); // Set custom input
                                                }
                                            }}
                                            onChange={(e, newValue) => {
                                                console.log("Selected State:", newValue?.name);
                                                if (newValue && typeof newValue === 'object') {
                                                    onChange(newValue.name); // Pass state name
                                                    fetchCityData(newValue.name, selectedCountry); // Fetch cities by state name
                                                }
                                            }}
                                            value={stateList.find(option => option.name === value) || value || null}
                                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select state"
                                                    error={Boolean(errors.state)}
                                                />
                                            )}
                                            loading={stateLoading}
                                        />
                                    )}
                                />
                                {errors.state && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.state.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="city">City</FormLabel>
                                <Controller
                                    name="city"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            defaultValue={dataToEdit?.city}
                                            options={cityList}
                                            freeSolo // Allows custom input
                                            onInputChange={(e, newInputValue) => {
                                                if (!cityList.some(option => option.name === newInputValue)) {
                                                    onChange(newInputValue); // Set custom input
                                                }
                                            }}
                                            onChange={(e, newValue) => {
                                                console.log("Selected city:", newValue?.name);
                                                if (newValue && typeof newValue === 'object') {
                                                    onChange(newValue.name); // Pass city name
                                                }
                                            }}
                                            value={cityList.find(option => option.name === value) || value || null}
                                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select city"
                                                    error={Boolean(errors.city)}
                                                />
                                            )}
                                            loading={cityLoading}
                                        />
                                    )}
                                />
                                {errors.city && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='postalCode'>Postal Code</FormLabel>
                                <Controller
                                    name="postalCode"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Postal Code Number'
                                            type="text"
                                            inputMode="numeric"
                                            onChange={onChange}
                                            id='postalCode'
                                            value={value}
                                            error={Boolean(errors.postalCode)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInputPhone
                                            }}
                                        />
                                    }
                                />
                                {errors.postalCode && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.postalCode.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel>Logo (File Upload)</FormLabel>
                                <Controller
                                    name="logo"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomFileUploads
                                            multiple={false}
                                            subtitle="(Max file size 3mb)"
                                            minHeight="100px"
                                            files={value}
                                            onChange={onChange}
                                            title={"Add Image"}
                                        // MediaUrl={MEDIA_URL}
                                        />
                                    )}
                                />
                                {errors?.logo && (
                                    <FormHelperText sx={{ color: "error.main" }}>
                                        {errors?.logo?.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} mt={3}>
                            <Typography variant="fm-p1" fontWeight={600}>Administrator/Point of Contact</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='adminFirstName'>Administrator First Name</FormLabel>
                                <Controller
                                    name="adminFirstName"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter First Name'
                                            onChange={onChange}
                                            id='adminFirstName'
                                            value={value}
                                            error={Boolean(errors.adminFirstName)}
                                            InputProps={{
                                                inputComponent: TextOnlyInput
                                            }}
                                        />
                                    }
                                />
                                {errors.adminFirstName && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.adminFirstName.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='adminLastName'>Administrator Last Name</FormLabel>
                                <Controller
                                    name="adminLastName"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Last Name'
                                            onChange={onChange}
                                            id='adminLastName'
                                            value={value}
                                            error={Boolean(errors.adminLastName)}
                                            InputProps={{
                                                inputComponent: TextOnlyInput
                                            }}
                                        />
                                    }
                                />
                                {errors.adminLastName && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.adminLastName.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='adminPhone'>Administrator Phone Number</FormLabel>
                                <Controller
                                    name="adminPhone"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <PhoneInput
                                            inputStyle={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "10px",
                                                backgroundColor: 'transparent'
                                            }}
                                            enableSearch={true}
                                            placeholder="Enter Phone Number"
                                            value={value}
                                            country={"us"} // Set default country
                                            onChange={(value, country) => {
                                                handlePhoneChange(value, country, "adminPhone");
                                            }}
                                        />
                                    )}
                                />
                                {errors.adminPhone && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.adminPhone.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>


                        <Grid item xs={12} mt={3}>
                            <Typography variant="fm-p1" fontWeight={600}>Program and Alumni Information</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='yearEstablished'>Year Established</FormLabel>
                                <Controller
                                    name='yearEstablished'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <DatePicker
                                            selected={value ? new Date(value, 0) : null}
                                            onChange={(date) => onChange(date.getFullYear())}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            customInput={
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    placeholder="yyyy"
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />}
                                        />
                                    )}
                                />
                                {errors.yearEstablished && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.yearEstablished.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='totalAlumniCount'>Total User Count</FormLabel>
                                <Controller
                                    name="totalAlumniCount"
                                    defaultValue={0}
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            placeholder='Enter Total User Count'
                                            onChange={onChange}
                                            id='totalAlumniCount'
                                            value={value}
                                            disabled
                                            error={Boolean(errors.totalAlumniCount)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput,
                                            }}
                                        />
                                    }
                                />
                                {errors.totalAlumniCount && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.totalAlumniCount.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='isActiveAlumniAssociations'>Active Alumni Associations</FormLabel>
                                <Controller
                                    name="isActiveAlumniAssociations"
                                    control={control}
                                    defaultValue={dataToEdit?.isActiveAlumniAssociations || false}
                                    render={({ field: { value, onChange } }) =>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Select Alumni Association"
                                            error={Boolean(errors?.isActiveAlumniAssociations)}
                                        >
                                            <MenuItem value={'true'}>True</MenuItem>
                                            <MenuItem value={'false'}>False</MenuItem>
                                        </Select>
                                    }
                                />
                                {errors.isActiveAlumniAssociations && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.isActiveAlumniAssociations.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>


                        {/* <Grid item xs={12} mt={3}>
                            <Typography variant="fm-p1" fontWeight={600}>Engagement Features Setup</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="preferredFeatures">
                                    Preferred Features
                                </FormLabel>
                                <Controller
                                    name="preferredFeatures"
                                    control={control}
                                    rules={{ required: 'At least one feature must be selected.' }}
                                    render={({ field: { value = [], onChange } }) => (
                                        <Select
                                            labelId="demo-multi-select-label"
                                            id="demo-multi-select"
                                            multiple
                                            value={Array.isArray(value) ? value : []} // Ensure value is always an array
                                            onChange={(event) => onChange(event.target.value)}
                                            renderValue={(selected) =>
                                                selected
                                                    .map((item) =>
                                                        item
                                                            .split('_')
                                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                            .join(' ')
                                                    )
                                                    .join(', ')
                                            }
                                        >
                                            <MenuItem value="event_management">
                                                <Checkbox checked={value?.includes('event_management')} />
                                                <ListItemText primary="Event Management" />
                                            </MenuItem>
                                            <MenuItem value="fundraising">
                                                <Checkbox checked={value?.includes('fundraising')} />
                                                <ListItemText primary="Fundraising" />
                                            </MenuItem>
                                            <MenuItem value="mentorship_programs">
                                                <Checkbox checked={value?.includes('mentorship_programs')} />
                                                <ListItemText primary="Mentorship Programs" />
                                            </MenuItem>
                                            <MenuItem value="alumni_directory">
                                                <Checkbox checked={value?.includes('alumni_directory')} />
                                                <ListItemText primary="Alumni Directory" />
                                            </MenuItem>
                                            <MenuItem value="lounge">
                                                <Checkbox checked={value?.includes('lounge')} />
                                                <ListItemText primary="Lounge" />
                                            </MenuItem>
                                            <MenuItem value="jobs_board">
                                                <Checkbox checked={value?.includes('jobs_board')} />
                                                <ListItemText primary="Jobs Board" />
                                            </MenuItem>
                                        </Select>
                                    )}
                                />

                                {errors.preferredFeatures && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.preferredFeatures.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid> */}
                        {/* <Grid item xs={12} mt={3}>
                            <Typography variant="fm-p1" fontWeight={600}>Existing Alumni Platform (if any)</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='existingAlumniPlatform' error={Boolean(errors.existingAlumniPlatform)}>Existing Alumni Platform</FormLabel>
                                <Controller
                                    name="existingAlumniPlatform"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Existing Alumni Platform'
                                            onChange={onChange}
                                            id='existingAlumniPlatform'
                                            value={value}
                                            error={Boolean(errors.existingAlumniPlatform)}
                                        />
                                    }
                                />
                                {errors.existingAlumniPlatform && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.existingAlumniPlatform.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid> */}
                        {/* <Grid item xs={12} mt={3}>
                            <Typography variant="fm-p1" fontWeight={600}>Integration Options</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='integrationNeeds'>Integration</FormLabel>
                                <Controller
                                    name="integrationNeeds"
                                    control={control}
                                    rules={{ required: 'At least one feature must be selected.' }}
                                    render={({ field: { value = [], onChange } }) => (
                                        <Select
                                            labelId="demo-multi-select-label"
                                            id="demo-multi-select"
                                            multiple
                                            value={Array.isArray(value) ? value : []}
                                            onChange={(event) => onChange(event.target.value)}
                                            renderValue={(selected) =>
                                                selected
                                                    .map((item) =>
                                                        item
                                                            .split('_')
                                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                            .join(' ')
                                                    )
                                                    .join(', ')
                                            }
                                        >
                                            <MenuItem value="crm">
                                                <Checkbox checked={value?.includes('crm')} />
                                                <ListItemText primary="CRM" />
                                            </MenuItem>
                                            <MenuItem value="payment_gateway">
                                                <Checkbox checked={value?.includes('payment_gateway')} />
                                                <ListItemText primary="Payment Gateway" />
                                            </MenuItem>
                                            <MenuItem value="facebook">
                                                <Checkbox checked={value?.includes('facebook')} />
                                                <ListItemText primary="Facebook" />
                                            </MenuItem>
                                            <MenuItem value="instagram">
                                                <Checkbox checked={value?.includes('instagram')} />
                                                <ListItemText primary="Instagram" />
                                            </MenuItem>
                                            <MenuItem value="linkedin">
                                                <Checkbox checked={value?.includes('linkedin')} />
                                                <ListItemText primary="Linkedin" />
                                            </MenuItem>
                                            <MenuItem value="twitter">
                                                <Checkbox checked={value?.includes('twitter')} />
                                                <ListItemText primary="Twitter" />
                                            </MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.integrationNeeds && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.integrationNeeds.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid> */}

                        <Grid item xs={12} mt={3}>
                            <Typography variant="fm-p1" fontWeight={600}>Customization Options</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='brandingFile'>Custom Branding (Upload Branding Guidelines or Files)</FormLabel>
                                <Controller
                                    name="brandingFile"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <CustomFileUploads
                                            multiple={false}
                                            subtitle="(Max file size 3mb)"
                                            minHeight="100px"
                                            files={value}
                                            onChange={onChange}
                                            title={"Upload"}
                                        // MediaUrl={MEDIA_URL}
                                        />
                                    }
                                />
                                {errors.brandingFile && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.brandingFile.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} mt={3}>
                            <Typography variant="fm-p1" fontWeight={600}>
                                Social Media Links
                            </Typography>
                        </Grid>

                        {/* {["LinkedIn", "Facebook", "Twitter", "Instagram"].map((platform) => (
                            <Grid item xs={6} key={platform}>
                                <FormControl fullWidth>
                                    <FormLabel
                                        htmlFor={`social_media_links_${platform.toLowerCase()}`}
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {platform} Link
                                    </FormLabel>
                                    <Controller
                                        name={`social_media_links.${platform.toLowerCase()}`}
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                type="url"
                                                placeholder={`Enter ${platform} link`}
                                                id={`social_media_links_${platform.toLowerCase()}`}
                                                value={value || ""}
                                                onChange={onChange}
                                                error={Boolean(errors?.social_media_links?.[platform.toLowerCase()])}
                                                helperText={
                                                    errors?.social_media_links?.[platform.toLowerCase()]
                                                        ? errors.social_media_links[platform.toLowerCase()].message
                                                        : ""
                                                }
                                            />
                                        )}
                                    />
                                    {errors?.social_media_links?.[platform.toLowerCase()] && (
                                        <FormHelperText sx={{ color: "error.main" }}>
                                            {errors.social_media_links[platform.toLowerCase()].message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        ))} */}

                        {["LinkedIn", "Facebook", "Twitter", "Instagram"].map((platform) => (
                            <Grid item xs={6} key={platform}>
                                <FormControl fullWidth>
                                    <FormLabel
                                        htmlFor={`social_media_links_${platform.toLowerCase()}`}
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {platform} Link
                                    </FormLabel>
                                    <Controller
                                        name={`social_media_links.${platform.toLowerCase()}`}
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                type="url"
                                                placeholder={`Enter ${platform} link`}
                                                id={`social_media_links_${platform.toLowerCase()}`}
                                                value={value || ""}
                                                onChange={onChange}
                                                error={Boolean(errors?.social_media_links?.[platform.toLowerCase()])}
                                                helperText={
                                                    errors?.social_media_links?.[platform.toLowerCase()]
                                                        ? errors.social_media_links[platform.toLowerCase()].message
                                                        : ""
                                                }
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        ))}


                        <Grid item xs={12} mt={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="fm-p1" fontWeight={600}>
                                Database Configuration
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset" fullWidth>
                                <Controller
                                    name="isExternalDbExist"
                                    control={control}
                                    defaultValue={dataToEdit?.isExternalDbExist}
                                    render={({ field: { value, onChange } }) => (
                                        <RadioGroup
                                            row
                                            value={value}
                                            onChange={(e) => onChange(e.target.value === "true")}
                                        >
                                            <FormControlLabel value={false} control={<Radio />} label="Setup in HiQLynks" disabled={mode === 'edit'} />
                                            <FormControlLabel value={true} control={<Radio />} label="Add External Database" disabled={mode === 'edit'} />
                                        </RadioGroup>
                                    )}
                                />
                                {errors.isExternalDbExist && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.isExternalDbExist.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        {isExternalDbExist === true && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <FormControl component="fieldset" fullWidth>
                                        <FormLabel htmlFor='dbHostName'>Hostname</FormLabel>
                                        <Controller
                                            name="dbHostName"
                                            control={control}
                                            render={({ field: { value, onChange } }) =>
                                                <TextField
                                                    placeholder='Enter Host Name'
                                                    onChange={onChange}
                                                    id='dbHostName'
                                                    value={value}
                                                    error={Boolean(errors.dbHostName)}
                                                    disabled={mode === 'edit'}
                                                />
                                            }
                                        />
                                        {errors.dbHostName && (
                                            <FormHelperText sx={{ color: 'error.main' }}>
                                                {errors.dbHostName.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl component="fieldset" fullWidth>
                                        <FormLabel htmlFor='databaseName'>DB Name</FormLabel>
                                        <Controller
                                            name="databaseName"
                                            control={control}
                                            render={({ field: { value, onChange } }) =>
                                                <TextField
                                                    placeholder='Enter DB Name'
                                                    onChange={onChange}
                                                    id='databaseName'
                                                    value={value}
                                                    error={Boolean(errors.databaseName)}
                                                    disabled={mode === 'edit'}
                                                />
                                            }
                                        />
                                        {errors.databaseName && (
                                            <FormHelperText sx={{ color: 'error.main' }}>
                                                {errors.databaseName.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl component="fieldset" fullWidth>
                                        <FormLabel htmlFor='dbUserName'>DB Username</FormLabel>
                                        <Controller
                                            name="dbUserName"
                                            control={control}
                                            render={({ field: { value, onChange } }) =>
                                                <TextField
                                                    placeholder='Enter User Name'
                                                    onChange={onChange}
                                                    id='dbUserName'
                                                    value={value}
                                                    error={Boolean(errors.dbUserName)}
                                                    disabled={mode === 'edit'}
                                                />
                                            }
                                        />
                                        {errors.dbUserName && (
                                            <FormHelperText sx={{ color: 'error.main' }}>
                                                {errors.dbUserName.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl component="fieldset" fullWidth>
                                        <FormLabel htmlFor='dbPassword'>DB Password</FormLabel>
                                        <Controller
                                            name="dbPassword"
                                            control={control}
                                            render={({ field: { value, onChange } }) =>
                                                <TextField
                                                    placeholder='Enter Password'
                                                    onChange={onChange}
                                                    id='dbPassword'
                                                    value={value}
                                                    error={Boolean(errors.dbPassword)}
                                                    disabled={mode === 'edit'}
                                                />
                                            }
                                        />
                                        {errors.dbPassword && (
                                            <FormHelperText sx={{ color: 'error.main' }}>
                                                {errors.dbPassword.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12} mt={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="fm-p1" fontWeight={600}>
                                Additional Comments/Requirements
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='additionalComments'>Additional Comments/Requirements</FormLabel>
                                <Controller
                                    name="additionalComments"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Additional Comments/Requirements'
                                            onChange={onChange}
                                            multiline
                                            id='additionalComments'
                                            value={value}
                                            error={Boolean(errors.additionalComments)}
                                        />
                                    }
                                />
                                {errors.additionalComments && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.additionalComments.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} mt={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="fm-p1" fontWeight={600}>
                                Submission and Confirmation
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='submittedBy'>Full Name</FormLabel>
                                <Controller
                                    name="submittedBy"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Full Name'
                                            onChange={onChange}
                                            id='submittedBy'
                                            value={value}
                                            error={Boolean(errors.submittedBy)}
                                        />
                                    }
                                />
                                {errors.submittedBy && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.submittedBy.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>



                        <Grid item xs={12} mt={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="fm-p1" fontWeight={600}>
                                Declaration/Verification Checkbox
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormGroup row>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                        By Continuing, you agree to our
                                    </Typography>

                                    <Controller
                                        name="isTermsAndConditions"
                                        control={control}
                                        defaultValue={dataToEdit?.isTermsAndConditions ?? false}
                                        rules={{ required: 'You must accept the Terms and Conditions' }}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                label={
                                                    <>
                                                        <Link to="https://bizvalleyinnovations.com/hiqlynks/terms.php" target="_blank" rel="noopener noreferrer">
                                                            Terms and Conditions
                                                        </Link>
                                                    </>
                                                }
                                                sx={errors.isTermsAndConditions ? { color: 'error.main' } : null}
                                                control={
                                                    <Checkbox
                                                        checked={field.value || false}
                                                        {...field}
                                                        sx={errors.isTermsAndConditions ? { color: 'error.main' } : null}
                                                    />
                                                }
                                            />
                                        )}
                                    />

                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                        And
                                    </Typography>

                                    <Controller
                                        name="isDataPrivacyAgreement"
                                        control={control}
                                        defaultValue={dataToEdit?.isDataPrivacyAgreement ?? false}
                                        rules={{ required: 'You must accept the Privacy Policy' }}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                label={
                                                    <>
                                                        <Link to="https://bizvalleyinnovations.com/hiqlynks/privacypolicy.php" target="_blank" rel="noopener noreferrer">
                                                            Privacy Policy
                                                        </Link>
                                                    </>
                                                }
                                                sx={errors.isDataPrivacyAgreement ? { color: 'error.main' } : null}
                                                control={
                                                    <Checkbox
                                                        checked={field.value || false}
                                                        {...field}
                                                        sx={errors.isDataPrivacyAgreement ? { color: 'error.main' } : null}
                                                    />
                                                }
                                            />
                                        )}
                                    />
                                </FormGroup>

                                {(errors.isDataPrivacyAgreement || errors.isTermsAndConditions) && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.isDataPrivacyAgreement?.message ||
                                            errors.isTermsAndConditions?.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>


                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <LoadingButton
                                size="large"
                                type="submit"
                                form="org-form"
                                variant="contained"
                                loading={loading}
                            >
                                {mode === 'edit' ? "Update" : "Submit"}
                            </LoadingButton>
                            <Button size="large" variant="outlined" onClick={handleFormCancel}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>

                </form>

            </Grid>
        </>
    )
}
export default Organization