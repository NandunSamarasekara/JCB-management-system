package com.jcb.jcb_management_systembackend.bookingmanagement.service;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import com.jcb.jcb_management_systembackend.usermanagement.model.Customer;
import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import com.jcb.jcb_management_systembackend.bookingmanagement.repository.BookingRepository;
import com.jcb.jcb_management_systembackend.jcbmanagement.repository.JCBRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.CustomerRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private JCBRepository jcbRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Transactional
    public String createBooking(Long customerId, String jcbType, String nic, String periodOfUse, String registeredNumber, Long driverId) {
        // Find the customer
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (!customerOpt.isPresent()) {
            return "Error: Customer not found";
        }
        Customer customer = customerOpt.get();

        // Find the specified JCB by registeredNumber
        Optional<JCB> jcbOpt = jcbRepository.findById(registeredNumber);
        if (!jcbOpt.isPresent()) {
            return "Error: JCB with registered number " + registeredNumber + " not found";
        }
        JCB selectedJCB = jcbOpt.get();

        // Verify JCB type and availability
        if (!selectedJCB.getJcbType().equals(jcbType)) {
            return "Error: JCB " + registeredNumber + " is not of type " + jcbType;
        }
        if (!selectedJCB.isAvailable()) {
            return "Error: JCB " + registeredNumber + " is not available";
        }

        // Find or assign a driver
        Driver selectedDriver;
        if (driverId != null) {
            Optional<Driver> driverOpt = driverRepository.findById(driverId);
            if (!driverOpt.isPresent()) {
                return "Error: Driver with ID " + driverId + " not found";
            }
            selectedDriver = driverOpt.get();
            if (!selectedDriver.isAvailable()) {
                return "Error: Driver with ID " + driverId + " is not available";
            }
        } else {
            List<Driver> availableDrivers = driverRepository.findByIsAvailableTrue();
            if (availableDrivers.isEmpty()) {
                return "Error: No available drivers found";
            }
            selectedDriver = availableDrivers.get(0); // Select the first available driver
        }

        // Create a new booking
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setJcb(selectedJCB);
        booking.setDriver(selectedDriver);
        booking.setNic(nic);
        booking.setPeriodOfUse(periodOfUse);
        booking.setCreatedAt(new Date());

        // Mark the JCB and driver as unavailable
        selectedJCB.setAvailable(false);
        selectedDriver.setAvailable(false);
        jcbRepository.save(selectedJCB);
        driverRepository.save(selectedDriver);

        // Save the booking
        bookingRepository.save(booking);

        return "Success: Booking created for JCB " + selectedJCB.getRegisteredNumber() + " (Type: " + jcbType + ", Price: " + selectedJCB.getRentalPrice() + ") with Driver ID: " + selectedDriver.getId();
    }

    public List<JCB> getAvailableJCBs() {
        return jcbRepository.findByIsAvailableTrue();
    }
}