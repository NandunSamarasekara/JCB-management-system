package com.jcb.jcb_management_systembackend.usermanagement.service;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Customer;
import com.jcb.jcb_management_systembackend.bookingmanagement.repository.CustomerRepository;
import com.jcb.jcb_management_systembackend.usermanagement.model.User;
import com.jcb.jcb_management_systembackend.usermanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public String registerCustomer(Customer customer) {
        // Check if email already exists
        if (userRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create User entity for authentication
        User user = new User();
        user.setEmail(customer.getEmail());
        user.setPassword(passwordEncoder.encode(customer.getPassword()));
        user.setRole("CUSTOMER");

        // Save user to User table
        userRepository.save(user);

        // Save customer to Customer table
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customerRepository.save(customer);

        return "Success: Customer registered with email " + customer.getEmail();
    }

    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.getRole().equals("CUSTOMER")) {
            throw new RuntimeException("Only customers can log in through this endpoint");
        }

        return "Success: Logged in as " + email;
    }
}