package com.jcb.jcb_management_systembackend.bookingmanagement.service;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import com.jcb.jcb_management_systembackend.usermanagement.model.Customer;
import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.bookingmanagement.repository.BookingRepository;
import com.jcb.jcb_management_systembackend.jcbmanagement.repository.JCBRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.CustomerRepository;
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

    @Transactional
    public String createBooking(Long customerId, String jcbType, String nic, String periodOfUse) {
        // Find the customer
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (!customerOpt.isPresent()) {
            return "Error: Customer not found";
        }
        Customer customer = customerOpt.get();

        // Find an available JCB of the requested type
        List<JCB> availableJCBs = jcbRepository.findByJcbTypeAndIsAvailableTrue(jcbType);
        if (availableJCBs.isEmpty()) {
            return "Error: No available JCBs of type " + jcbType;
        }

        // Select the first available JCB
        JCB selectedJCB = availableJCBs.get(0);

        // Create a new booking
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setJcb(selectedJCB);
        booking.setNic(nic);
        booking.setPeriodOfUse(periodOfUse);
        booking.setCreatedAt(new Date());

        // Mark the JCB as unavailable
        selectedJCB.setAvailable(false);
        jcbRepository.save(selectedJCB);

        // Save the booking
        bookingRepository.save(booking);

        return "Success: Booking created for JCB " + selectedJCB.getRegisteredNumber() + " (Type: " + jcbType + ", Price: " + selectedJCB.getRentalPrice() + ")";
    }

    public List<JCB> getAvailableJCBs() {
        return jcbRepository.findByIsAvailableTrue();
    }
}