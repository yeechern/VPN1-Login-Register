import React from 'react'
import { useEffect, useState } from "react";
import { Snackbar, Alert, Button, Box } from "@mui/material"
import { useLocation, Link } from "react-router-dom";
import { useAuth } from './AuthContext';

const Home = () => {
  const { currentUser } = useAuth()
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: '',
  })

  const handleCloseSnackbar = () => {
    setSnackbar(prevState => ({
      ...prevState,
      open: false,
    }));
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (location.state?.loginSuccess) {
      showSnackbar("Login successful!", "success");
      location.state.loginSuccess = false;
    }
  }, [location.state?.loginSuccess]) //only rerun the effect if state change 

  return (
    <Box sx={{marginLeft:5}}>
      <div>
        <h1>This is Home</h1>
        <p>Welcome {currentUser.username}</p>
        <p>{currentUser.useremail}</p>
      </div>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

  )
}

export default Home