import React from 'react'
import {
    Box,
    Paper,
    Typography,
} from '@mui/material'

const Device = () => {

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 5, height: 800 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: 1200 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    Devices
                </Typography>
            </Paper>
        </Box>
    )
}

export default Device