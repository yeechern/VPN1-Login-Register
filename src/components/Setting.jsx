import React, { useState } from 'react'
import i18n from 'i18next';
import { useAuth } from './AuthContext'
import bcrypt from 'bcryptjs'
import {
    Button,
    Box,
    Alert,
    Snackbar,
    Typography,
    TextField,
    Divider,
    Paper,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Stack,
    Switch
} from '@mui/material'
import {
    Language,
    Notifications,
    Lock
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Setting = () => {
    const {t} = useTranslation();

    const { currentUser } = useAuth()
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || 'en');
    const [currentPassword, setCurrentPassword] = useState('');//for varify before change the password 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [emailNotice, setEmailNotice] = useState(true);
    const [pushNotice, setPushNotice] = useState(true);

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

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };



    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value
        setSelectedLanguage(selectedLanguage);
        i18n.changeLanguage(selectedLanguage)
        localStorage.setItem('language',selectedLanguage)
        console.log(`Change language to ${selectedLanguage}`)
    };

    const handleEmailNoticeChange = (event) =>{
        const newValue = event.target.checked
        setEmailNotice(newValue)
        console.log(`Set Email notification to ${newValue}`)
    }

    const handlePushNoticeChange = (event) =>{
        const newValue = event.target.checked
        setPushNotice(newValue)
        console.log(`Set Push notification to ${newValue}`)
    }

    const SectionHeader = ({ icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {icon}
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {title}
            </Typography>
        </Box>
    );

    const passwordValidation = () => {
        if(!newPassword || !confirmPassword || !currentPassword){
            showSnackbar("All fields are required!","error")
            return false;
        }

        if (newPassword !== confirmPassword) {
            showSnackbar("Passwords do not match!", "error")
            return false;
        }

        if (currentPassword === newPassword){
            showSnackbar("The new password must not be same.", "error")
            return false;
        }
        return true;
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwordValidation()) {
            return;
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        try {
            const response = await fetch("http://localhost:5000/changePassword", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userEmail: currentUser.useremail, currentPassword, newPassword:hashedPassword }), //fetch the user to body // server site have problem 
            });
            console.log("Response:", response);

            if (!response.ok) {
                // Server returned an error status code
                const errorData = await response.json();
                console.error("Change Password failed:", errorData);
                showSnackbar(`Change Password failed: ${errorData.error || 'Unknown error'}`, "error")
                return;
            }
            const data = await response.json();
            console.log("User password changed:", data);
            showSnackbar("Password Change successfully", "success")
        } catch (error) {
            console.error("Error:", error);
            showSnackbar("An error occurred while changing password.", "error")
        }


    };




    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 5, height: 800 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: 1200 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                {t('setting.settings')}
                </Typography>

                {/* Language Section */}
                <Box sx={{ mb: 6 }}>
                    <SectionHeader icon={<Language color="primary" />} title={t('setting.language')} />
                    <FormControl fullWidth sx={{ maxWidth: 400 }}>
                        <InputLabel id="language-select-label">{t('setting.selectLanguage')}</InputLabel>
                        <Select
                            labelId="language-select-label"
                            id="language-select"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            label="Select Language"
                        >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Spanish</MenuItem>
                            <MenuItem value="fr">French</MenuItem>
                            <MenuItem value="de">German</MenuItem>
                            <MenuItem value="zh">中文</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ mb: 6 }}>
                    <SectionHeader icon={<Notifications color="primary" />} title={t('setting.notifications')} />
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <Typography sx={{ minWidth: 150 }} >{t('setting.emailNotifications')}</Typography>
                            <Switch
                                checked={emailNotice}
                                onChange={handleEmailNoticeChange}
                                sx={{ ml: 20 }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ minWidth: 150 }}>{t('setting.pushNotifications')}</Typography>
                            <Switch
                                checked={pushNotice}
                                onChange={handlePushNoticeChange}
                                sx={{ ml: 20 }}
                            />
                        </Box>
                    </Stack>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ mb: 4 }}>
                    <SectionHeader icon={<Lock color="primary" />} title={t('setting.changePassword')} />
                    <form onSubmit={handlePasswordChange}>
                        <Stack spacing={3} sx={{ maxWidth: 400 }}>
                            <TextField
                                type="password"
                                label={t('setting.currentPassword')}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                type="password"
                                label={t('setting.newPassword')}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                type="password"
                                label={t('setting.confirmNewPassword')}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ mt: 2 }}
                                onClick={handlePasswordChange}
                            >
                                {t('setting.updatePassword')}
                            </Button>
                        </Stack>
                    </form>
                </Box>


                {/* language setting, notification setting, change password */}

            </Paper >
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
        </Box >

    )
}

export default Setting