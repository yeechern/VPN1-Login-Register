import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

const drawerWidth = 250;

export default function NavDrawer({children}) {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const userLogout = () => {
        console.log("User logout: ", currentUser.username);
        setCurrentUser({
            userName: null,
            userEmail: null,
            userPassword: null,
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
        navigate('/login');
    };

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const DrawerList = (
        <Box sx={{ width: drawerWidth }} role="presentation">
            <List>
                {['Home', 'Subscription', 'Profile'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton 
                            component={Link} 
                            to={`/${text.toLowerCase()}`}
                            onClick={toggleDrawer(false)}
                        > 
                            <ListItemIcon>
                                {index === 0 ? (
                                    <HomeIcon/>
                                ): index === 1 ?(
                                    <LoyaltyIcon/>
                                ): index === 2 ?(
                                    <PersonIcon/>
                                ): (
                                    <HomeIcon/>
                                )}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Button
                id="logoutButton"
                variant="contained"
                sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block"
                }}
                onClick={() => userLogout()}
            >
                Logout
            </Button>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar 
                position="fixed" 
                sx={{
                    width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
                    ml: open ? `${drawerWidth}px` : 0,
                    transition: theme => theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer(true)}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: 100,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="temporary"
                anchor="left"
                open={open}
                onClose={handleDrawerClose}  // Add onClose handler
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
            >
                {DrawerList}
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: open ? `${drawerWidth}px` : 0,
                    transition: theme => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar /> {/* Spacing for AppBar */}
                {children} {/* Render the page content */}
            </Box>
        </Box>
    );

}