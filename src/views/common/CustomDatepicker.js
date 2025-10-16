import React, { useState } from "react";
import { TextField } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import { format } from "date-fns"; // Import the date-fns library for date formatting
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";

const Datepicker = ({ value, onChange, onDateChange, error }) => {
    const handleDateChange = (date) => {
        onDateChange(date);
        onChange(date);
    };

    const formatDate = (date) => {
        // Convert the date to the desired format
        return date ? format(date, "dd/MM/yyyy") : "";
    };

    return (
        <>
            <DatePickerWrapper>
                <DatePicker
                    selected={value}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    // dropdownMode="select"
                    style={{ width: "100%" }}
                    placeholderText="DD/MM/YYYY"
                    customInput={
                        <TextField
                            error={error && !value}  // Set error prop based on the condition
                            fullWidth
                            variant="outlined"
                            placeholder="DD/MM/YYYY"
                            value={formatDate(value)} // Set the formatted value here
                            InputProps={{
                                style: {
                                    // border: "1px solid #B1A8BA",
                                    //borderRadius: "142px",
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayOutlinedIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    }
                />
            </DatePickerWrapper>
        </>
    );
};

export default Datepicker;
