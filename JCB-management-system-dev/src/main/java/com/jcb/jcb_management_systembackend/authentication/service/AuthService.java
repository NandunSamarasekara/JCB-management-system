package com.jcb.jcb_management_systembackend.authentication.service;

import com.jcb.jcb_management_systembackend.authentication.dto.AuthResponse;
import com.jcb.jcb_management_systembackend.authentication.dto.LoginRequest;
import com.jcb.jcb_management_systembackend.authentication.dto.RegisterRequest;
import com.jcb.jcb_management_systembackend.usermanagement.model.*;
import com.jcb.jcb_management_systembackend.usermanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private MechanicRepository mechanicRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    public AuthResponse register(RegisterRequest request) {
        try {
            String role = request.getRole().toUpperCase();

            // Check if user already exists
            if (userExists(request.getEmail(), request.getNic())) {
                return new AuthResponse(false, "User with this email or NIC already exists", null);
            }

            switch (role) {
                case "CUSTOMER":
                    Customer customer = new Customer();
                    customer.setNic(request.getNic());
                    customer.setEmail(request.getEmail());
                    customer.setFirstName(request.getFirstName());
                    customer.setLastName(request.getLastName());
                    customer.setPassword(request.getPassword()); // In production, hash this!
                    customerRepository.save(customer);
                    break;

                case "ADMIN":
                    Admin admin = new Admin();
                    admin.setNic(request.getNic());
                    admin.setEmail(request.getEmail());
                    admin.setFirstName(request.getFirstName());
                    admin.setLastName(request.getLastName());
                    admin.setPassword(request.getPassword());
                    adminRepository.save(admin);
                    break;

                case "DRIVER":
                    Driver driver = new Driver();
                    driver.setNic(request.getNic());
                    driver.setEmail(request.getEmail());
                    driver.setFirstName(request.getFirstName());
                    driver.setLastName(request.getLastName());
                    driver.setPassword(request.getPassword());
                    driver.setAvailable(true); // New drivers are available by default
                    driverRepository.save(driver);
                    break;

                case "MECHANIC":
                    Mechanic mechanic = new Mechanic();
                    mechanic.setNic(request.getNic());
                    mechanic.setEmail(request.getEmail());
                    mechanic.setFirstName(request.getFirstName());
                    mechanic.setLastName(request.getLastName());
                    mechanic.setPassword(request.getPassword());
                    mechanicRepository.save(mechanic);
                    break;

                case "OWNER":
                    Owner owner = new Owner();
                    owner.setNic(request.getNic());
                    owner.setEmail(request.getEmail());
                    owner.setFirstName(request.getFirstName());
                    owner.setLastName(request.getLastName());
                    owner.setPassword(request.getPassword());
                    // Set subscription plan (default to BASIC if not provided)
                    String subscriptionPlan = request.getSubscriptionPlan();
                    if (subscriptionPlan == null || subscriptionPlan.isEmpty()) {
                        subscriptionPlan = "BASIC";
                    }
                    owner.setSubscriptionPlan(subscriptionPlan.toUpperCase());
                    ownerRepository.save(owner);
                    break;

                default:
                    return new AuthResponse(false, "Invalid role specified", null);
            }

            return new AuthResponse(true, "Registration successful", null);

        } catch (Exception e) {
            e.printStackTrace();
            return new AuthResponse(false, "Registration failed: " + e.getMessage(), null);
        }
    }

    public AuthResponse login(LoginRequest request) {
        try {
            String role = request.getRole().toUpperCase();
            Map<String, Object> userData = new HashMap<>();

            switch (role) {
                case "CUSTOMER":
                    Optional<Customer> customer = customerRepository.findByEmail(request.getEmail());
                    if (customer.isPresent() && customer.get().getPassword().equals(request.getPassword())) {
                        userData.put("nic", customer.get().getNic());
                        userData.put("email", customer.get().getEmail());
                        userData.put("firstName", customer.get().getFirstName());
                        userData.put("lastName", customer.get().getLastName());
                        return new AuthResponse(true, "Login successful", userData);
                    }
                    break;

                case "ADMIN":
                    Optional<Admin> admin = adminRepository.findByEmail(request.getEmail());
                    if (admin.isPresent() && admin.get().getPassword().equals(request.getPassword())) {
                        userData.put("nic", admin.get().getNic());
                        userData.put("email", admin.get().getEmail());
                        userData.put("firstName", admin.get().getFirstName());
                        userData.put("lastName", admin.get().getLastName());
                        return new AuthResponse(true, "Login successful", userData);
                    }
                    break;

                case "DRIVER":
                    Optional<Driver> driver = driverRepository.findByEmail(request.getEmail());
                    if (driver.isPresent() && driver.get().getPassword().equals(request.getPassword())) {
                        userData.put("nic", driver.get().getNic());
                        userData.put("email", driver.get().getEmail());
                        userData.put("firstName", driver.get().getFirstName());
                        userData.put("lastName", driver.get().getLastName());
                        return new AuthResponse(true, "Login successful", userData);
                    }
                    break;

                case "MECHANIC":
                    Optional<Mechanic> mechanic = mechanicRepository.findByEmail(request.getEmail());
                    if (mechanic.isPresent() && mechanic.get().getPassword().equals(request.getPassword())) {
                        userData.put("nic", mechanic.get().getNic());
                        userData.put("email", mechanic.get().getEmail());
                        userData.put("firstName", mechanic.get().getFirstName());
                        userData.put("lastName", mechanic.get().getLastName());
                        return new AuthResponse(true, "Login successful", userData);
                    }
                    break;

                case "OWNER":
                    Optional<Owner> owner = ownerRepository.findByEmail(request.getEmail());
                    if (owner.isPresent() && owner.get().getPassword().equals(request.getPassword())) {
                        userData.put("nic", owner.get().getNic());
                        userData.put("email", owner.get().getEmail());
                        userData.put("firstName", owner.get().getFirstName());
                        userData.put("lastName", owner.get().getLastName());
                        userData.put("subscriptionPlan", owner.get().getSubscriptionPlan());
                        userData.put("monthlyFee", owner.get().getMonthlyFee());
                        return new AuthResponse(true, "Login successful", userData);
                    }
                    break;

                default:
                    return new AuthResponse(false, "Invalid role specified", null);
            }

            return new AuthResponse(false, "Invalid credentials", null);

        } catch (Exception e) {
            e.printStackTrace();
            return new AuthResponse(false, "Login failed: " + e.getMessage(), null);
        }
    }

    private boolean userExists(String email, String nic) {
        return customerRepository.findByEmail(email).isPresent() ||
               customerRepository.findById(nic).isPresent() ||
               adminRepository.findByEmail(email).isPresent() ||
               adminRepository.findById(nic).isPresent() ||
               driverRepository.findByEmail(email).isPresent() ||
               driverRepository.findById(nic).isPresent() ||
               mechanicRepository.findByEmail(email).isPresent() ||
               mechanicRepository.findById(nic).isPresent() ||
               ownerRepository.findByEmail(email).isPresent() ||
               ownerRepository.findById(nic).isPresent();
    }
}
