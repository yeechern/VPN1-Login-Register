import LoginForm from '../components/LoginForm'
import Register from '../components/Register'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography
} from '@mui/material'
import { useState } from 'react'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && children}
    </div>
  );
}

function PageLogin() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width:'100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={8}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#764ba2',
                },
                '& .Mui-selected': {
                  color: '#764ba2 !important',
                },
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <TabPanel value={tabValue} index={0}>
              <LoginForm />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Register />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PageLogin