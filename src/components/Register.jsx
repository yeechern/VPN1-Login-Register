import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import {
    Box,
    TextField,
    Snackbar,
    Alert,
    Button,
    Typography,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Register = () => {
    const [user, setUser] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        userStatus: "Normal",
        balanceAmount: 0,
        totalPoints: 0,
        memberLevel: "",
        memberExpired: null,
        registerDate: null,
        lastUsedDate: null,
        trafficUsed: 0,
        registeredIP: "",
        deviceNumber: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleCloseSnackbar = () => {
        setSnackbar(prevState => ({
            ...prevState,
            open: false,
        }));
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleInputChange = (key, value) => {
        setUser((prevUser) => ({
            ...prevUser,
            [key]: value
        }));
    };

    const validation = () => {
        if (!user.userName || !user.userEmail || !user.userPassword || !confirmPassword) {
            showSnackbar("All fields are required!", "error");
            return false;
        }

        if (user.userPassword !== confirmPassword) {
            showSnackbar("Passwords do not match!", "error");
            return false;
        }

        return true;
    };

    const registerUser = async (e) => {
        e.preventDefault();
        if (!validation()) {
            return;
        }
        console.log("Registering user:", user);

        const hashedPassword = bcrypt.hashSync(user.userPassword, 10);
        const userToRegister = { ...user, userPassword: hashedPassword }; //new variable to store hashed pass
        console.log("Registering user:", userToRegister);

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userToRegister), //fetch the user to body
            });
            console.log("Response:", response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Registration failed:", errorData);
                showSnackbar(`Registration failed: ${errorData.error || 'Unknown error'}`, "error");
                return;
            }
            const data = await response.json();
            console.log("User registered:", data);
            showSnackbar("User registered successfully!", "success");
        } catch (error) {
            console.error("Error:", error);
            showSnackbar("An error occurred while registering the user.", "error");
        }
    };

    return (
        <Box
            component="form"
            sx={{
                my: 5,
                width: "400px",
                padding: 4,
                mx: 'auto',
                bgcolor: "white",
                border: "1px solid black",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}
            noValidate
            autoComplete="off"
        >
            <Typography
                variant='h5'
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 3,
                }}
            >
                Register
            </Typography>

            <TextField
                id="regName"
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
            />
            <TextField
                id="regEmail"
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
                margin="normal"
                value={user.userEmail}
                onChange={(e) => handleInputChange("userEmail", e.target.value)}
            />
            <TextField
                id="regPassword"
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
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                edge="end"
                            >
                                {passwordVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                type={confirmPasswordVisible ? "text" : "password"}
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                edge="end"
                            >
                                {confirmPasswordVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                id="registerButton"
                variant="contained"
                sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block"
                }}
                onClick={registerUser}
            >
                Register
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


export default Register;

