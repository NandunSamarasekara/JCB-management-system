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
    public String createBooking(String customerNic, String jcbType, Date rentalDate, Date returnDate, boolean acceptPrice, boolean acceptTerms) {
        // Validate form inputs
        if (!acceptPrice || !acceptTerms) {
            return "Error: Price and terms must be accepted";
        }
        if (rentalDate == null || returnDate == null || rentalDate.after(returnDate)) {
            return "Error: Invalid rental or return date";
        }

        // Find the customer
        Optional<Customer> customerOpt = customerRepository.findById(customerNic);
        if (!customerOpt.isPresent()) {
            return "Error: Customer with NIC " + customerNic + " not found";
        }
        Customer customer = customerOpt.get();

        // Find an available JCB of the specified type
        List<JCB> availableJcbs = jcbRepository.findByJcbTypeAndIsAvailableTrue(jcbType);
        if (availableJcbs.isEmpty()) {
            return "Error: No available JCBs of type " + jcbType;
        }
        JCB selectedJcb = availableJcbs.get(0); // Select the first available JCB

        // Find an available driver
        List<Driver> availableDrivers = driverRepository.findByIsAvailableTrue();
        if (availableDrivers.isEmpty()) {
            return "Error: No available drivers found";
        }
        Driver selectedDriver = availableDrivers.get(0); // Select the first available driver

        // Create a new booking
        Booking booking = new Booking();
        booking.setCustomerId(customerNic);
        booking.setCustomerEmail(customer.getEmail());
        booking.setJcbId(selectedJcb.getRegisteredNumber());
        booking.setOwnerId(selectedJcb.getOwner().getNic());
        booking.setOwnerEmail(selectedJcb.getOwner().getEmail());
        booking.setDriverId(selectedDriver.getNic());
        booking.setDriverEmail(selectedDriver.getEmail());
        booking.setRentalDate(rentalDate);
        booking.setReturnDate(returnDate);
        booking.setCustomer(customer);
        booking.setJcb(selectedJcb);
        booking.setDriver(selectedDriver);
        booking.setOwner(selectedJcb.getOwner());

        // Mark the JCB and driver as unavailable
        selectedJcb.setAvailable(false);
        selectedDriver.setAvailable(false);
        jcbRepository.save(selectedJcb);
        driverRepository.save(selectedDriver);

        // Save the booking
        bookingRepository.save(booking);

        return "Success: Booking created for JCB " + selectedJcb.getRegisteredNumber() + " (Type: " + jcbType + ", Price: " + selectedJcb.getRentalPrice() + ") with Driver NIC: " + selectedDriver.getNic();
    }

    public List<JCB> getAvailableJCBs() {
        return jcbRepository.findByIsAvailableTrue();
    }
}