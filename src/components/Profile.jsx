import React from 'react'
import { useAuth } from './AuthContext'
import { 
    Button, 
    Box, 
    Typography, 
    Dialog, 
    DialogActions,
    DialogContent,
    DialogContentText, 
    DialogTitle,
    Paper,
    Avatar,
    Card,
    CardContent
} from '@mui/material'
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { currentUser } = useAuth()
    const [openDelete, setOpenDelete] = useState(false)
    const navigate = useNavigate()
    const { t } = useTranslation()

    const DataTitle = ({ text }) => {
        return (
            <Typography
                variant="subtitle1"
                sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    mb: 1
                }}
            >
                {text}
            </Typography>
        )
    }

    const DisplayData = ({ text }) => {
        return (
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 500,
                    mb: 3,
                    color: 'text.primary'
                }}
            >
                {text || "N/A"}
            </Typography>
        )
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }).format(date);
        } catch (error) {
            return "Invalid Date";
        }
    };

    const deleteConfirmOpen = () => {
        setOpenDelete(true)
    }

    const deleteConfirmClose = () => {
        setOpenDelete(false)
    }

    const deleteAccount = async () => {
        event.preventDefault()
        console.log("Deleting account email:", currentUser.useremail)
        
        try {
            const response = await fetch("http://localhost:5000/deleteUser", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userEmail:currentUser.useremail})
            });
            console.log("Response", response)

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Delete failed:", errorData);
                showSnackbar(`Delete failed: ${errorData.error || "Unknown error"}`, "error");
                return;
            }
            const data = await response.json();
            console.log("User deleted", data)
            navigate("/login",{state:{accountDeleted:true}})
        } catch (error) {
            console.error("Error during account deletion:", error);
            showSnackbar("Network error: Unable to reach the server.", "error");
        }
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 5 ,height:800}}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2}}>
                {/* Header Section */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 4, 
                    pb: 3, 
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Avatar 
                        sx={{ 
                            width: 80, 
                            height: 80, 
                            bgcolor: 'primary.main',
                            mr: 3 
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {t('profile.userProfile')}
                    </Typography>
                </Box>

                {/* Main Content */}
                <Grid container spacing={6}>
                    {/* Personal Information */}
                    <Grid xs={12} md={6} component={Grid}>
                        <Card variant="outlined" sx={{ mb: 3, borderRadius: 2, width:400 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                {t('profile.personalInformation')}
                                </Typography>
                                <DataTitle text={t('profile.userID')} />
                                <DisplayData text={currentUser?.userid} />
                                <DataTitle text={t('profile.userName')} />
                                <DisplayData text={currentUser?.username} />
                                <DataTitle text={t('profile.email')} />
                                <DisplayData text={currentUser?.useremail} />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Membership Details */}
                    <Grid component={Grid} xs={12} md={6}>
                        <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 ,width:400}}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                {t('profile.membershipDetails')}
                                </Typography>
                                <DataTitle text={t('profile.balanceAmount')} />
                                <DisplayData text={currentUser?.balanceamount} />
                                <DataTitle text={t('profile.totalPoints')} />
                                <DisplayData text={currentUser?.totalpoints} />
                                <DataTitle text={t('profile.memberLevel')} />
                                <DisplayData text={currentUser?.memberlevel} />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Dates Information */}
                    <Grid component={Grid} xs={12}>
                        <Card variant="outlined" sx={{ mb: 4, borderRadius: 2, width:900 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                {t('profile.dates')}
                                </Typography>
                                <Grid container spacing={7}>
                                    <Grid component={Grid} xs={12} md={4}>
                                        <DataTitle text={t('profile.memberExpiredDate')}/>
                                        <DisplayData text={currentUser?.memberexpired} />
                                    </Grid>
                                    <Grid component={Grid} xs={12} md={4}>
                                        <DataTitle text={t('profile.lastUseDate')} />
                                        <DisplayData text={formatDate(currentUser?.lastuseddate)} />
                                    </Grid>
                                    <Grid component={Grid} xs={12} md={4}>
                                        <DataTitle text={t('profile.userRegisteredDate')} />
                                        <DisplayData text={formatDate(currentUser?.registerdate)} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Delete Account Button */}
                <Box sx={{ mt: 2 }}>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={deleteConfirmOpen}
                        startIcon={<DeleteIcon />}
                        sx={{ 
                            py: 1,
                            px: 3,
                            borderRadius: 2
                        }}
                    >
                        {t('profile.deleteAccount')}
                    </Button>
                </Box>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDelete}
                onClose={deleteConfirmClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ pb: 2 }}>
                    {"Are you sure you want to delete your account?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone. All your data will be permanently deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        variant="outlined" 
                        onClick={deleteConfirmClose}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error"
                        onClick={deleteAccount} 
                        autoFocus
                    >
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Profile