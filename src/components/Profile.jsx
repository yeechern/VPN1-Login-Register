import React from 'react'
import { useAuth } from './AuthContext'
import { Button, Box, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

const Profile = () => {
    const { currentUser } = useAuth()

    const DataTitle = ({ text }) => {
        return (
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    textAlign: "start",
                    marginBottom: 3,
                }}
            >
                {text}
            </Typography>
        )
    }

    const DisplayData = ({ text }) => {
        return(
            <Typography
                variant="h6"
                sx={{
                    textAlign: "start",
                    marginBottom: 3,
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

    const deleteAccount = () => {

    }

    return (
        <Box sx={{ marginLeft: 5 }}>
            <Typography
                variant="h2"
                sx={{
                    fontWeight: "bold",
                    textAlign: "start",
                    marginBottom: 3,
                }}
            >
                User Profile
            </Typography>

            <DataTitle text="User ID" />
            <DisplayData text = {currentUser?.userid}/>
            <DataTitle text="Username" />
            <DisplayData text = {currentUser?.username}/>
            <DataTitle text="Email" />
            <DisplayData text = {currentUser?.useremail}/>
            <DataTitle text="Balance Amount" />
            <DisplayData text = {currentUser?.balanceamount}/>
            <DataTitle text="Total Points" />
            <DisplayData text = {currentUser?.totalpoints}/>
            <DataTitle text="Member Level" />
            <DisplayData text = {currentUser?.memberlevel}/>
            <DataTitle text="Member Expired Date" />
            <DisplayData text = {currentUser?.memberexpired}/>
            <DataTitle text="User Registered Date" />
            <DisplayData text = {formatDate(currentUser?.registerdate)}/>

            <Button variant='contained' color="error" onClick={() => deleteAccount()}>
                Delete Account
            </Button>



        </Box>



    )
}

export default Profile