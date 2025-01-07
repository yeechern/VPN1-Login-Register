import React, { useState } from 'react';
import {
    Box,
    Drawer,
    Button,
    List,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Typography,
    Collapse
} from '@mui/material';
//<icons>
import HomeIcon from '@mui/icons-material/Home';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import ArticleIcon from '@mui/icons-material/Article';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import DevicesIcon from '@mui/icons-material/Devices';
//</icons>
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

const drawerWidth = 250;



const menuItems = () => {

    //translate by using i18next
    const { t } = useTranslation()

    return [

        {
            text: t('navigation.home'),
            path: '/home',
            icon: <HomeIcon />,
        },
        {
            text: t('navigation.account'),
            icon: <AccountCircleIcon />,
            subItems: [
                { text: t('navigation.profile'), path: '/profile', icon: <PersonIcon /> },
                { text: t('navigation.subscription'), path: '/subscription', icon: <LoyaltyIcon /> },
                { text: t('navigation.devices'), path: '/devices', icon: <DevicesIcon /> },
                { text: t('navigation.settings'), path: '/setting', icon: <SettingsIcon /> },

            ],
        },
        {
            text: t('navigation.aboutUs'),
            icon: <InfoIcon />,
            subItems: [
                { text: t('navigation.termOfService'), path: '/term-service', icon: <ArticleIcon /> },
                { text: t('navigation.privacyPolicy'), path: '/privacy-policy', icon: <SecurityIcon /> },
                { text: t('navigation.faq'), path: '/faq', icon: <HelpOutlineIcon /> }
            ]
        }
    ]
};

const NavDrawer = ({ children }) => {
    const { t } = useTranslation()
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState({});



    const userLogout = () => {
        console.log("User logout: ", currentUser.username);
        logout();
        navigate('/login');
    };

    const toggleDropdown = (index) => {
        setOpenDropdown((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const renderMenuItems = menuItems().map((item, index) => (
        <React.Fragment key={item.text}>
            <ListItem disablePadding>
                <ListItemButton
                    component={item.path ? Link : 'button'}
                    to={item.path || undefined}
                    onClick={item.subItems ? () => toggleDropdown(index) : undefined}
                    sx={{
                        backgroundColor: location.pathname === item.path ? 'blue' : 'transparent',
                        '&:hover': {
                            backgroundColor: location.pathname === item.path ? 'darkblue' : 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
                >
                    <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.text}
                        sx={{
                            color: location.pathname === item.path ? 'white' : 'inherit',
                            '& .MuiTypography-root': {
                                fontWeight: location.pathname === item.path ? 'bold' : 'regular',
                            },
                        }}
                    />
                    {item.subItems && (openDropdown[index] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
            </ListItem>
            {item.subItems && (
                <Collapse in={openDropdown[index]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.subItems.map((subItem) => (
                            <ListItem key={subItem.text} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={subItem.path}
                                    sx={{
                                        pl: 4,
                                        backgroundColor: location.pathname === subItem.path ? 'blue' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: location.pathname === subItem.path
                                                ? 'darkblue'
                                                : 'rgba(0, 0, 0, 0.04)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: location.pathname === subItem.path ? 'white' : 'inherit' }}>
                                        {subItem.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={subItem.text}
                                        sx={{
                                            color: location.pathname === subItem.path ? 'white' : 'inherit',
                                            '& .MuiTypography-root': {
                                                fontWeight: location.pathname === subItem.path ? 'bold' : 'regular',
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            )}
        </React.Fragment>
    ));

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <Typography variant="h3">
                        Proxy
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        mt: "56px", //space of appbar
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box sx={{
                    width: drawerWidth,
                    height: '100%',
                    position: 'relative'
                }} role="presentation">
                    <List>{renderMenuItems}</List>

                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%'

                    }}>
                        <Divider sx={{ mb: 5 }} />
                        <Button
                            id="logoutButton"
                            variant="contained"
                            sx={{
                                mb: 10,
                                mx: "auto",
                                display: "block",
                            }}
                            onClick={userLogout}
                        >
                            {t('navigation.logout')}
                        </Button>
                    </Box>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${drawerWidth}px)`,
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default NavDrawer;