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
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';

const Home = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: '',
  });
  const [selectedRow, setRowSelected] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasShowConnected, setHasShowConnected] = useState(false)

  const [protocols, setProtocols] = useState(() => {
    const savedProtocols = localStorage.getItem('protocols');
    return savedProtocols ? JSON.parse(savedProtocols) : [
      {
        id: 1,
        remarks: 'Singapore',
        protocol: 'VMess',
        add: 'sg1.example.com',
        port: '443',
        net: 'ws',
        tls: 'Yes',
        latency: 86,
        speed: 150
      }
    ];
  });

  const resetProtocols = () => {
    window.electronAPI.checkOutbounds(true);
    const defaultProtocols = [
      {
        id: 1,
        remarks: 'Singapore',
        protocol: 'VMess',
        add: 'sg1.example.com',
        port: '443',
        net: 'ws',
        tls: 'Yes',
        latency: 85,
        speed: 150,
      },
    ];
    setProtocols(defaultProtocols); // Reset state
    localStorage.setItem('protocols', JSON.stringify(defaultProtocols)); // Save to localStorage
  };

  useEffect(() => {
    localStorage.setItem('protocols', JSON.stringify(protocols));
  }, [protocols]);


  function decodeLink(link) {
    const protocol = link.split("://")[0]
    switch (protocol) {
      case "ss":
        return window.electronAPI.decodeShadowSocks(link)
      case "vmess":
        return window.electronAPI.decodeVmess(link);
      case "trojan":
        return window.electronAPI.decodeTroless(link);
      case "vless":
        return window.electronAPI.decodeTroless(link);
      default:
        throw new Error("Invalid Link");
    }
  }

  function importLink() {
    window.electronAPI.readClipboard()
      .then(async (content) => {
        try {
          const decoded = await decodeLink(content); // Decoding the content of the clipboard

          // Check if 'reality' is part of the decoded data for VLESS
          const isReality = decoded.realitySettings !== null;
          const realitySettings = decoded.realitySettings || {};

          setProtocols((prevProtocols) => {
            const newId = prevProtocols.length > 0 ? Math.max(...prevProtocols.map(p => p.id)) + 1 : 0;

            const newProtocol = {
              id: newId,
              remarks: decoded.ps,
              protocol: decoded.protocol,
              add: decoded.add,
              port: decoded.port,
              net: decoded.net || "-",
              tls: decoded.scy || "-",
              uuid: decoded.id,
              scy: decoded.scy,
              type: decoded.type,
              aid: decoded.aid || "-",
              v: decoded.v,
              method: decoded.method,
              latency: decoded.latency || "-",
              speed: decoded.speed || "-",
              flow: decoded.flow,
              realitySettings: isReality ? realitySettings : null, // Include REALITY settings if applicable
            };

            showSnackbar("Link Copied from Clipboard", "success");
            console.log("New Protocol", newProtocol);

            return [...prevProtocols, newProtocol];
          });
        } catch (error) {
          showSnackbar(error.message, "error");
        }
      })
      .catch((error) => {
        console.error('Error reading clipboard:', error);
      });
  }


  const handleRowClick = async (config) => {
    window.electronAPI.checkOutbounds(true); // reset the outbound
    setRowSelected(config.id);
    console.log("Creating Config file", config)
    try {
      await window.electronAPI.processConfig(config)
    } catch (error) {
      showSnackbar(error.message, "error")
    }
  }

  const deleteRow = async (id) => {
    window.electronAPI.checkOutbounds(true)
    setProtocols(prevProtocols => {
      const updatedProtocols = prevProtocols.filter(protocol => protocol.id !== id);
      localStorage.setItem('protocols', JSON.stringify(updatedProtocols));
      return updatedProtocols;
    })
    showSnackbar("Node deleted", "info");
  }

  //<button Side>
  const startProxy = async () => {
    try {
      await window.electronAPI.checkOutbounds(false);
      await window.electronAPI.startProxy();
      window.electronAPI.startXray();
      setIsConnected(true)
      setHasShowConnected(false)
    } catch (error) {
      showSnackbar(error.message, "error")
    }
  }

  const stopProxy = async () => {
    try {
      await window.electronAPI.stopProxy();
      window.electronAPI.stopXray();
      setIsConnected(false)
      setHasShowConnected(false)
    } catch (error) {
      showSnackbar(error.message, "error")
    }
  }

  const toggleConnection = () => {
    if (isConnected) {
      stopProxy()
    } else {
      startProxy()
    }
  }
  //</button Side>

  useEffect(() => {
    window.electronCallbackFunctions.onXrayOutput(() => {
      if (!hasShowConnected) {
        showSnackbar("Connected Successfully", 'success');
      }
      setHasShowConnected(true)

    })
    window.electronCallbackFunctions.onXrayOutputError((error) => {
      showSnackbar(`Xray Error: ${error}`, 'error');
      window.electronAPI.stopProxy();
      setIsConnected(false);
    })
    window.electronCallbackFunctions.onXrayError((error) => {
      showSnackbar(`Xray Error: ${error}`, 'error');
      window.electronAPI.stopProxy();
      setIsConnected(false);
    })
    window.electronCallbackFunctions.onXrayNotFound((error) => {
      showSnackbar(`Xray Not Found: ${error}`, 'error');
      window.electronAPI.stopProxy();
      setIsConnected(false);
    })
    window.electronCallbackFunctions.onXrayExit((code) => {
      if (code) {
        showSnackbar(`Exited with code: ${code}`, 'error');
        setIsConnected(false);
      } else {
        showSnackbar('Connection Terminated', 'info');
      }
      window.electronAPI.stopProxy();
    })
  }, []);

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


  return (
    <Box sx={{ width: '100%', height: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h4" sx={{ mt: 2, mb: 4, fontWeight: 'bold' }}>
        Connection
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Button
          onClick={() => {
            toggleConnection()
            showSnackbar("Connected Successfully", "sucess")
          }}
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
            {protocols.map((protocol) => (
              <TableRow
                key={protocol.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover={!isConnected}
                style={{ cursor: isConnected ? 'not-allowed' : 'pointer', backgroundColor: selectedRow === protocol.id ? 'lightblue' : 'inherit' }}
                onClick={() => {
                  if (!isConnected) {
                    handleRowClick(protocol)
                  }
                }}
              >
                <TableCell>{protocol.remarks}</TableCell>
                <TableCell>{protocol.protocol}</TableCell>
                <TableCell>{protocol.add}</TableCell>
                <TableCell>{protocol.port}</TableCell>
                <TableCell>{protocol.net}</TableCell>
                <TableCell>{protocol.tls}</TableCell>
                <TableCell>{protocol.latency}</TableCell>
                <TableCell>{protocol.speed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={importLink}
          startIcon={<GetAppIcon />}>
          Import Link
        </Button>
        <Button
          variant="outlined"
          color='warning'
          hover={!isConnected}
          style={{ cursor: isConnected ? 'not-allowed' : 'pointer' }}
          onClick={() => {
            if (!isConnected) {
              deleteRow(selectedRow)
            }
          }}
          startIcon={<DeleteIcon />}>
          Delete Row
        </Button>
        <Button
          variant="outlined"
          color='warning'
          hover={!isConnected}
          style={{ cursor: isConnected ? 'not-allowed' : 'pointer' }}
          onClick={() => {
            if (!isConnected) {
              resetProtocols
            }
          }}
        >
          Reset Row
        </Button>

      </Box>




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