package com.jcb.jcb_management_systembackend.usermanagement.service;

import com.jcb.jcb_management_systembackend.usermanagement.model.*;
import com.jcb.jcb_management_systembackend.usermanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private MechanicRepository mechanicRepository;

    public String registerUser(String firstName, String lastName, String email, String password, String nic, String role) {
        switch (role.toUpperCase()) {
            case "CUSTOMER":
                Customer customer = new Customer();
                customer.setFirstName(firstName);
                customer.setLastName(lastName);
                customer.setEmail(email);
                customer.setPassword(password);
                customer.setNic(nic);
                customerRepository.save(customer);
                return "Success: User registered as CUSTOMER";

            case "OWNER":
                Owner owner = new Owner();
                owner.setFirstName(firstName);
                owner.setLastName(lastName);
                owner.setEmail(email);
                owner.setPassword(password);
                owner.setNic(nic);
                ownerRepository.save(owner);
                return "Success: User registered as OWNER";

            case "DRIVER":
                Driver driver = new Driver();
                driver.setFirstName(firstName);
                driver.setLastName(lastName);
                driver.setEmail(email);
                driver.setPassword(password);
                driver.setNic(nic);
                driver.setAvailable(true);
                driverRepository.save(driver);
                return "Success: User registered as DRIVER";

            case "ADMIN":
                Admin admin = new Admin();
                admin.setFirstName(firstName);
                admin.setLastName(lastName);
                admin.setEmail(email);
                admin.setPassword(password);
                admin.setNic(nic);
                adminRepository.save(admin);
                return "Success: User registered as ADMIN";

            case "MECHANIC":
                Mechanic mechanic = new Mechanic();
                mechanic.setFirstName(firstName);
                mechanic.setLastName(lastName);
                mechanic.setEmail(email);
                mechanic.setPassword(password);
                mechanic.setNic(nic);
                mechanicRepository.save(mechanic);
                return "Success: User registered as MECHANIC";

            default:
                return "Error: Invalid role";
        }
    }
}