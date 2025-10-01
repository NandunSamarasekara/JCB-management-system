package com.jcb.jcb_management_systembackend.usermanagement.controller;

import com.jcb.jcb_management_systembackend.usermanagement.model.Customer;
import com.jcb.jcb_management_systembackend.usermanagement.model.Owner;
import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import com.jcb.jcb_management_systembackend.usermanagement.model.Mechanic;
import com.jcb.jcb_management_systembackend.usermanagement.model.Admin;
import com.jcb.jcb_management_systembackend.usermanagement.repository.CustomerRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.OwnerRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.DriverRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.MechanicRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// Updated to use existsByEmail and singular table names
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class UserController {

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

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterUserRequest request) {
        if (request.getNic() == null || request.getNic().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: NIC is required");
        }

        try {
            switch (request.getRole().toUpperCase()) {
                case "CUSTOMER":
                    if (customerRepository.existsById(request.getNic())) {
                        return ResponseEntity.badRequest().body("Error: Customer with NIC " + request.getNic() + " already exists");
                    }
                    if (customerRepository.existsByEmail(request.getEmail())) {
                        return ResponseEntity.badRequest().body("Error: Email " + request.getEmail() + " is already in use");
                    }
                    Customer customer = new Customer();
                    customer.setNic(request.getNic());
                    customer.setFirstName(request.getFirstName());
                    customer.setLastName(request.getLastName());
                    customer.setEmail(request.getEmail());
                    customer.setPassword(request.getPassword());
                    customerRepository.save(customer);
                    return ResponseEntity.ok("Success: User registered as CUSTOMER");

                case "OWNER":
                    if (ownerRepository.existsById(request.getNic())) {
                        return ResponseEntity.badRequest().body("Error: Owner with NIC " + request.getNic() + " already exists");
                    }
                    if (ownerRepository.existsByEmail(request.getEmail())) {
                        return ResponseEntity.badRequest().body("Error: Email " + request.getEmail() + " is already in use");
                    }
                    Owner owner = new Owner();
                    owner.setNic(request.getNic());
                    owner.setFirstName(request.getFirstName());
                    owner.setLastName(request.getLastName());
                    owner.setEmail(request.getEmail());
                    owner.setPassword(request.getPassword());
                    ownerRepository.save(owner);
                    return ResponseEntity.ok("Success: User registered as OWNER");

                case "DRIVER":
                    if (driverRepository.existsById(request.getNic())) {
                        return ResponseEntity.badRequest().body("Error: Driver with NIC " + request.getNic() + " already exists");
                    }
                    if (driverRepository.existsByEmail(request.getEmail())) {
                        return ResponseEntity.badRequest().body("Error: Email " + request.getEmail() + " is already in use");
                    }
                    Driver driver = new Driver();
                    driver.setNic(request.getNic());
                    driver.setFirstName(request.getFirstName());
                    driver.setLastName(request.getLastName());
                    driver.setEmail(request.getEmail());
                    driver.setPassword(request.getPassword());
                    driverRepository.save(driver);
                    return ResponseEntity.ok("Success: User registered as DRIVER");

                case "MECHANIC":
                    if (mechanicRepository.existsById(request.getNic())) {
                        return ResponseEntity.badRequest().body("Error: Mechanic with NIC " + request.getNic() + " already exists");
                    }
                    if (mechanicRepository.existsByEmail(request.getEmail())) {
                        return ResponseEntity.badRequest().body("Error: Email " + request.getEmail() + " is already in use");
                    }
                    Mechanic mechanic = new Mechanic();
                    mechanic.setNic(request.getNic());
                    mechanic.setFirstName(request.getFirstName());
                    mechanic.setLastName(request.getLastName());
                    mechanic.setEmail(request.getEmail());
                    mechanic.setPassword(request.getPassword());
                    mechanicRepository.save(mechanic);
                    return ResponseEntity.ok("Success: User registered as MECHANIC");

                case "ADMIN":
                    if (adminRepository.existsById(request.getNic())) {
                        return ResponseEntity.badRequest().body("Error: Admin with NIC " + request.getNic() + " already exists");
                    }
                    if (adminRepository.existsByEmail(request.getEmail())) {
                        return ResponseEntity.badRequest().body("Error: Email " + request.getEmail() + " is already in use");
                    }
                    Admin admin = new Admin();
                    admin.setNic(request.getNic());
                    admin.setFirstName(request.getFirstName());
                    admin.setLastName(request.getLastName());
                    admin.setEmail(request.getEmail());
                    admin.setPassword(request.getPassword());
                    adminRepository.save(admin);
                    return ResponseEntity.ok("Success: User registered as ADMIN");

                default:
                    return ResponseEntity.badRequest().body("Error: Invalid role");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequest request) {
        String role = request.getRole().toUpperCase();
        boolean found = false;
        String nic = "";
        switch (role) {
            case "CUSTOMER":
                Optional<Customer> customerOpt = customerRepository.findByEmail(request.getEmail());
                if (customerOpt.isPresent() && customerOpt.get().getPassword().equals(request.getPassword())) {
                    found = true;
                    nic = customerOpt.get().getNic();
                }
                break;
            case "OWNER":
                Optional<Owner> ownerOpt = ownerRepository.findByEmail(request.getEmail());
                if (ownerOpt.isPresent() && ownerOpt.get().getPassword().equals(request.getPassword())) {
                    found = true;
                    nic = ownerOpt.get().getNic();
                }
                break;
            case "DRIVER":
                Optional<Driver> driverOpt = driverRepository.findByEmail(request.getEmail());
                if (driverOpt.isPresent() && driverOpt.get().getPassword().equals(request.getPassword())) {
                    found = true;
                    nic = driverOpt.get().getNic();
                }
                break;
            case "MECHANIC":
                Optional<Mechanic> mechanicOpt = mechanicRepository.findByEmail(request.getEmail());
                if (mechanicOpt.isPresent() && mechanicOpt.get().getPassword().equals(request.getPassword())) {
                    found = true;
                    nic = mechanicOpt.get().getNic();
                }
                break;
            case "ADMIN":
                Optional<Admin> adminOpt = adminRepository.findByEmail(request.getEmail());
                if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(request.getPassword())) {
                    found = true;
                    nic = adminOpt.get().getNic();
                }
                break;
            default:
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid role"));
        }

        if (found) {
            // In production, generate a real JWT token here
            Map<String, String> response = new HashMap<>();
            response.put("nic", nic);
            response.put("role", role);
            response.put("token", "mock-jwt-token-" + nic); // Replace with real JWT
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }
    }

    // DTO for request body
    public static class RegisterUserRequest {
        private String nic;
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String role;

        public String getNic() {
            return nic;
        }

        public void setNic(String nic) {
            this.nic = nic;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;
        private String role;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}