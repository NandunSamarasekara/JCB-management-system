import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Container, Alert, Typography } from '@mui/material';

// Registration form for creating a new user account
const Register = () => {
    // State for form fields
    const [nic, setNic] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER'); // Default role
    const [error, setError] = useState(''); // Error message for failed registration
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic client-side validation
        if (!nic || !firstName || !lastName || !email || !password) {
            setError('All fields are required');
            return;
        }

        try {
            // Send registration data to backend
            await registerUser({
                nic,
                firstName,
                lastName,
                email,
                password,
                role,
            });
            // Redirect to login page on success
            navigate('/login');
        } catch (err) {
            // Display error from backend (e.g., duplicate NIC or email)
            setError(err.response?.data || 'Registration failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            {/* Page title */}
            <Typography variant="h4" gutterBottom align="center">
                Register
            </Typography>

            {/* Error message display */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Registration form */}
            <form onSubmit={handleSubmit}>
                {/* NIC input */}
                <TextField
                    label="NIC"
                    fullWidth
                    margin="normal"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    required
                    variant="outlined"
                />

                {/* First Name input */}
                <TextField
                    label="First Name"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    variant="outlined"
                />

                {/* Last Name input */}
                <TextField
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    variant="outlined"
                />

                {/* Email input */}
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                />

                {/* Password input */}
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    variant="outlined"
                />

                {/* Role dropdown */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <MenuItem value="CUSTOMER">Customer</MenuItem>
                        <MenuItem value="OWNER">Owner</MenuItem>
                        <MenuItem value="DRIVER">Driver</MenuItem>
                        <MenuItem value="MECHANIC">Mechanic</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                </FormControl>

                {/* Submit button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Register
                </Button>
            </form>
        </Container>
    );
};

export default Register;