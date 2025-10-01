import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h2" gutterBottom>
                Welcome to JCB Management System
            </Typography>
            <Typography variant="body1" paragraph>
                The JCB Management System streamlines the process of renting and managing JCB machines for construction and excavation needs. Whether you're a customer looking to book a JCB, an owner managing your fleet, a driver operating the machines, a mechanic maintaining them, or an admin overseeing operations, our platform has you covered.
            </Typography>
            <Typography variant="h4" gutterBottom>
                Benefits
            </Typography>
            <Box component="ul" sx={{ textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
                <li>Effortless booking with real-time availability</li>
                <li>Secure role-based access for all users</li>
                <li>Track and manage JCBs efficiently</li>
                <li>Transparent pricing and terms</li>
                <li>Seamless communication between customers, owners, and drivers</li>
            </Box>
            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/register')}
                    sx={{ mr: 2 }}
                >
                    Register
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/login')}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Homepage;