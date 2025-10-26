package com.jcb.jcb_management_systembackend.config;

import com.jcb.jcb_management_systembackend.usermanagement.model.Admin;
import com.jcb.jcb_management_systembackend.usermanagement.model.Customer;
import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import com.jcb.jcb_management_systembackend.usermanagement.model.Mechanic;
import com.jcb.jcb_management_systembackend.usermanagement.model.Owner;
import com.jcb.jcb_management_systembackend.usermanagement.repository.AdminRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.CustomerRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.DriverRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.MechanicRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.OwnerRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DataLoader {

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

    @PostConstruct
    public void loadData() {
        // Check if data already exists
        if (customerRepository.count() == 0) {
            // Create test customer
            Customer customer = new Customer();
            customer.setNic("CUST001");
            customer.setEmail("customer@test.com");
            customer.setFirstName("Test");
            customer.setLastName("Customer");
            customer.setPassword("password123");
            customerRepository.save(customer);

            System.out.println("Test customer created: customer@test.com / password123");
        }

        if (adminRepository.count() == 0) {
            // Create test admin
            Admin admin = new Admin();
            admin.setNic("ADMIN001");
            admin.setEmail("admin@test.com");
            admin.setFirstName("Test");
            admin.setLastName("Admin");
            admin.setPassword("password123");
            adminRepository.save(admin);

            System.out.println("Test admin created: admin@test.com / password123");
        }

        if (driverRepository.count() == 0) {
            // Create test driver
            Driver driver = new Driver();
            driver.setNic("DRIVER001");
            driver.setEmail("driver@test.com");
            driver.setFirstName("Test");
            driver.setLastName("Driver");
            driver.setPassword("password123");
            driver.setAvailable(true);
            driverRepository.save(driver);

            System.out.println("Test driver created: driver@test.com / password123");
        }

        if (mechanicRepository.count() == 0) {
            // Create test mechanic
            Mechanic mechanic = new Mechanic();
            mechanic.setNic("MECH001");
            mechanic.setEmail("mechanic@test.com");
            mechanic.setFirstName("Test");
            mechanic.setLastName("Mechanic");
            mechanic.setPassword("password123");
            mechanicRepository.save(mechanic);

            System.out.println("Test mechanic created: mechanic@test.com / password123");
        }

        if (ownerRepository.count() == 0) {
            // Create test owner
            Owner owner = new Owner();
            owner.setNic("OWNER001");
            owner.setEmail("owner@test.com");
            owner.setFirstName("Test");
            owner.setLastName("Owner");
            owner.setPassword("password123");
            owner.setSubscriptionPlan("PREMIUM");
            ownerRepository.save(owner);

            System.out.println("Test owner created: owner@test.com / password123");
        }
    }
}