import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
    Box,
    TextField,
    Snackbar,
    Alert,
    Button,
    Typography,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginForm = () => {
    const [user, setUser] = useState({
        userEmail: "",
        userPassword: "",
    });

    const { login } = useAuth();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

    const handleCloseSnackbar = () => {
        setSnackbar((prevState) => ({
            ...prevState,
            open: false,
        }));
    };

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleInputChange = (key, value) => {
        setUser((prevUser) => ({
            ...prevUser,
            [key]: value,
        }));
    };

    const navigate = useNavigate();

    const userLogin = async (event) => {
        event.preventDefault();
        console.log("Login request: ", user);

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            console.log("Response:", response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Login failed:", errorData);
                showSnackbar(`Login failed: ${errorData.error || "Unknown error"}`, "error");
                return;
            }
            const data = await response.json();
            console.log("User login:", data);
            login(data.user);
            navigate("/home", { state: { loginSuccess: true } });

        } catch (error) {
            console.error("Error:", error);
            showSnackbar("Network error: Unable to reach the server.", "error");
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <Box
            component="form"
            sx={{
                width: "400px",
                padding: 4,
                my: 5,
                mx: "auto",
                bgcolor: "white",
                border: "1px solid black",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}
            noValidate
            autoComplete="off"
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 3,
                }}
            >
                Login
            </Typography>

            <TextField
                id="loginEmail"
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
                margin="normal"
                value={user.userEmail}
                onChange={(e) => handleInputChange("userEmail", e.target.value)}
            />

            <TextField
                id="loginPassword"
                label="Password"
                variant="outlined"
                type={passwordVisible ? "text" : "password"}
                fullWidth
                margin="normal"
                value={user.userPassword}
                onChange={(e) => handleInputChange("userPassword", e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onMouseEnter={togglePasswordVisibility}
                                onMouseLeave={togglePasswordVisibility}
                                edge="end"
                            >
                                {passwordVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                id="loginButton"
                variant="contained"
                sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                }}
                onClick={userLogin}
            >
                Login
            </Button>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};


export default LoginForm;


