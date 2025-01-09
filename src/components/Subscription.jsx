import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    Divider,
} from '@mui/material';

const Subscription = () => {
    const plans = [
        {
            name: 'Basic Plan',
            price: '$5/month',
            features: ['1 Device', 'Standard Speed', 'Basic Encryption'],
        },
        {
            name: 'Pro Plan',
            price: '$10/month',
            features: ['5 Devices', 'High Speed', 'Advanced Encryption'],
        },
        {
            name: 'Premium Plan',
            price: '$15/month',
            features: ['Unlimited Devices', 'Ultra High Speed', 'Best Encryption'],
        },
    ];

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 5, height: 800 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    Subscription Plans
                </Typography>
                <Grid container spacing={4}>
                    {plans.map((plan, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    border: '1px solid #e0e0e0',
                                    minHeight: 300, // Ensures all cards have the same height
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    {plan.name}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                                    {plan.price}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box>
                                    {plan.features.map((feature, i) => (
                                        <Typography key={i} variant="body1" sx={{ mb: 1 }}>
                                            {feature}
                                        </Typography>
                                    ))}
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3 }}
                                >
                                    Subscribe
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default Subscription;
