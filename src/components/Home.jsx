import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Alert,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAuth } from './AuthContext';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const Home = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: '',
  });

  const [isConnected, setIsConnected] = useState(false);

  // Sample VPN nodes data - replace with your actual data
  const vpnNodes = [
    {
      remarks: 'Singapore',
      protocol: 'VMess',
      address: 'sg1.example.com',
      port: '443',
      transport: 'ws',
      tls: 'Yes',
      latency: 85,
      speed: 150
    },
    {
      remarks: 'Japan',
      protocol: 'VMess',
      address: 'jp1.example.com',
      port: '443',
      transport: 'tcp',
      tls: 'Yes',
      latency: 95,
      speed: 120
    },
    // Add more nodes as needed
  ];

  const handleRowClick = (node) => {
    console.log(node)
  }

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
  }, [location.state?.loginSuccess]);

  const connectButtonClick = () => {
    setIsConnected(!isConnected);
    showSnackbar(
      isConnected ? "Disconnected successfully" : "Connected successfully",
      "success"
    );
  };

  return (
    <Box sx={{ width: '100%', height: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h4" sx={{ mt: 2, mb: 4, fontWeight: 'bold' }}>
        Connection
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Button
          onClick={connectButtonClick}
          id='proxy-connection'
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: isConnected ? 'cyan' : 'grey',
            '&:hover': {
              backgroundColor: isConnected ? 'darkcyan' : 'darkgrey',
            },
            transition: 'background-color 0.3s ease',
          }}
        >
          <PowerSettingsNewIcon sx={{ fontSize: 48, color: 'black' }} />
        </Button>
        <Typography variant="h6">
          {isConnected ? "Connected" : "Disconnected"}
        </Typography>
      </Box>

      {/* VPN Nodes Table */}
      <TableContainer component={Paper} sx={{ mt: 4, mx: 'auto', maxWidth: '150%', width: '100%' }}>
        <Table sx={{ minWidth: 1500, alignItems: 'center' }} aria-label="VPN nodes table">
          <TableHead>
            <TableRow>
              <TableCell>Remarks</TableCell>
              <TableCell>Protocol</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Transport</TableCell>
              <TableCell>TLS</TableCell>
              <TableCell>Latency (ms)</TableCell>
              <TableCell>Speed (Mbps)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vpnNodes.map((node, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleRowClick(node)}
                hover
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{node.remarks}</TableCell>
                <TableCell>{node.protocol}</TableCell>
                <TableCell>{node.address}</TableCell>
                <TableCell>{node.port}</TableCell>
                <TableCell>{node.transport}</TableCell>
                <TableCell>{node.tls}</TableCell>
                <TableCell>{node.latency}</TableCell>
                <TableCell>{node.speed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
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
  );
};

export default Home;