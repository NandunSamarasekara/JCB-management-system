package com.jcb.jcb_management_systembackend.usermanagement.service;

import com.jcb.jcb_management_systembackend.usermanagement.model.*;
import com.jcb.jcb_management_systembackend.usermanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private MechanicRepository mechanicRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Transactional
    public String registerUser(String firstName, String lastName, String email, String password, UserRole role) {
        // Check if email already exists
        if (userRepository.findByEmail(email) != null) {
            return "Error: Email already registered";
        }

        // Create user record
        User user = new User();
        user.setEmail(email);
        user.setPassword(password); // In production, hash the password
        user.setRole(role);
        userRepository.save(user);

        // Save to specific role table
        switch (role) {
            case CUSTOMER:
                Customer customer = new Customer();
                customer.setFirstName(firstName);
                customer.setLastName(lastName);
                customer.setEmail(email);
                customer.setPassword(password);
                customerRepository.save(customer);
                break;
            case OWNER:
                Owner owner = new Owner();
                owner.setFirstName(firstName);
                owner.setLastName(lastName);
                owner.setEmail(email);
                owner.setPassword(password);
                ownerRepository.save(owner);
                break;
            case DRIVER:
                Driver driver = new Driver();
                driver.setFirstName(firstName);
                driver.setLastName(lastName);
                driver.setEmail(email);
                driver.setPassword(password);
                driverRepository.save(driver);
                break;
            case MECHANIC:
                Mechanic mechanic = new Mechanic();
                mechanic.setFirstName(firstName);
                mechanic.setLastName(lastName);
                mechanic.setEmail(email);
                mechanic.setPassword(password);
                mechanicRepository.save(mechanic);
                break;
            case ADMIN:
                Admin admin = new Admin();
                admin.setFirstName(firstName);
                admin.setLastName(lastName);
                admin.setEmail(email);
                admin.setPassword(password);
                adminRepository.save(admin);
                break;
            default:
                return "Error: Invalid role";
        }

        return "Success: User registered as " + role;
    }

    public Optional<User> loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) { // In production, compare hashed passwords
            return Optional.of(user);
        }
        return Optional.empty();
    }
}