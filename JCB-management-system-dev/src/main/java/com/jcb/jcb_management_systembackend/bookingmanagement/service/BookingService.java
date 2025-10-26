package com.jcb.jcb_management_systembackend.bookingmanagement.service;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import com.jcb.jcb_management_systembackend.usermanagement.model.Customer;
import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import com.jcb.jcb_management_systembackend.bookingmanagement.repository.BookingRepository;
import com.jcb.jcb_management_systembackend.jcbmanagement.repository.JCBRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.CustomerRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.DriverRepository;
import com.jcb.jcb_management_systembackend.bookingmanagement.stratergy.CashPayment;
import com.jcb.jcb_management_systembackend.bookingmanagement.stratergy.CreditCardPayment;
import com.jcb.jcb_management_systembackend.bookingmanagement.stratergy.PayPalPayment;
import com.jcb.jcb_management_systembackend.bookingmanagement.stratergy.PaymentStrategy;
import com.jcb.jcb_management_systembackend.reviewmanagement.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    @Autowired
    private ReviewRepository reviewRepository;

    private PaymentStrategy paymentStrategy;  // Strategy for payment processing

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    @Transactional
    public String createBooking(String customerNic, String jcbType, Date rentalDate, Date returnDate, boolean acceptPrice, boolean acceptTerms, String paymentMethod) {
        // Validate form inputs
        if (!acceptPrice || !acceptTerms) {
            return "Error: Price and terms must be accepted";
        }
        if (rentalDate == null || returnDate == null || rentalDate.after(returnDate)) {
            return "Error: Invalid rental or return date";
        }
        if (paymentMethod == null || paymentMethod.isEmpty()) {
            return "Error: Payment method must be selected";
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

        // Calculate total amount (assume rentalPrice is per day)
        LocalDate rentalLocal = rentalDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate returnLocal = returnDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        long days = ChronoUnit.DAYS.between(rentalLocal, returnLocal) + 1;
        double totalAmount = selectedJcb.getRentalPrice() * days;

        // Set strategy based on paymentMethod (using Strategy Pattern to avoid if-else chains for processing)
        switch (paymentMethod.toLowerCase()) {
            case "credit_card":
                setPaymentStrategy(new CreditCardPayment());
                break;
            case "paypal":
                setPaymentStrategy(new PayPalPayment());
                break;
            case "cash":
                setPaymentStrategy(new CashPayment());
                break;
            default:
                return "Error: Invalid payment method";
        }

        // Process payment using the selected strategy
        String paymentResult = paymentStrategy.processPayment(totalAmount);
        if (paymentResult.contains("Error")) {  // Simulate failure check
            return paymentResult;
        }

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
        booking.setPaymentMethod(paymentMethod.toUpperCase());
        booking.setTotalAmount(totalAmount);
        booking.setPaymentStatus("COMPLETED"); // Mark as completed after payment processing

        // Mark the JCB and driver as unavailable
        selectedJcb.setAvailable(false);
        selectedDriver.setAvailable(false);
        jcbRepository.save(selectedJcb);
        driverRepository.save(selectedDriver);

        // Save the booking
        bookingRepository.save(booking);

        return "Success: Booking created for JCB " + selectedJcb.getRegisteredNumber() + " (Type: " + jcbType + ", Total Price: LKR " + totalAmount + "). " + paymentResult;
    }

    public List<JCB> getAvailableJCBs() {
        return jcbRepository.findByIsAvailableTrue();
    }

    public List<Booking> getBookingsByCustomer(String customerNic) {
        return bookingRepository.findByCustomerId(customerNic);
    }

    @Transactional
    public boolean deleteBooking(Long bookingId) {
        try {
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            if (!bookingOpt.isPresent()) {
                logger.warn("Attempt to delete non-existent booking with ID: {}", bookingId);
                return false;
            }

            Booking booking = bookingOpt.get();
            
            // Delete associated reviews first to avoid foreign key constraint violation
            reviewRepository.deleteByBookingId(bookingId);
            logger.info("Deleted associated reviews for booking ID {}", bookingId);
            
            // Make the JCB and driver available again
            JCB jcb = booking.getJcb();
            if (jcb != null) {
                jcb.setAvailable(true);
                jcbRepository.save(jcb);
                logger.info("JCB {} marked as available", jcb.getRegisteredNumber());
            }

            Driver driver = booking.getDriver();
            if (driver != null) {
                driver.setAvailable(true);
                driverRepository.save(driver);
                logger.info("Driver {} marked as available", driver.getNic());
            }

            // Delete the booking
            bookingRepository.deleteById(bookingId);
            logger.info("Booking with ID {} deleted successfully", bookingId);
            return true;
        } catch (Exception e) {
            logger.error("Error deleting booking with ID {}: {}", bookingId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete booking: " + e.getMessage(), e);
        }
    }

    @Transactional
    public String updateBooking(Long bookingId, String newJcbType, Date newRentalDate, Date newReturnDate) {
        // Validate dates
        if (newRentalDate == null || newReturnDate == null || newRentalDate.after(newReturnDate)) {
            return "Error: Invalid rental or return date";
        }

        // Find the existing booking
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            return "Error: Booking not found";
        }

        Booking booking = bookingOpt.get();
        JCB currentJcb = booking.getJcb();
        Driver currentDriver = booking.getDriver();
        String currentJcbType = currentJcb != null ? currentJcb.getJcbType() : "";

        // Check if JCB type is changing
        boolean jcbTypeChanged = newJcbType != null && !newJcbType.equals(currentJcbType);

        if (jcbTypeChanged) {
            // Need to find a new JCB of the new type
            List<JCB> availableJcbs = jcbRepository.findByJcbTypeAndIsAvailableTrue(newJcbType);
            if (availableJcbs.isEmpty()) {
                return "Error: No available JCBs of type " + newJcbType;
            }

            JCB newJcb = availableJcbs.get(0);

            // Make the old JCB available again
            if (currentJcb != null) {
                currentJcb.setAvailable(true);
                jcbRepository.save(currentJcb);
            }

            // Assign the new JCB
            booking.setJcbId(newJcb.getRegisteredNumber());
            booking.setJcb(newJcb);
            booking.setOwnerId(newJcb.getOwner().getNic());
            booking.setOwnerEmail(newJcb.getOwner().getEmail());
            booking.setOwner(newJcb.getOwner());

            // Mark the new JCB as unavailable
            newJcb.setAvailable(false);
            jcbRepository.save(newJcb);
        }

        // Update dates
        booking.setRentalDate(newRentalDate);
        booking.setReturnDate(newReturnDate);

        // Save the updated booking
        bookingRepository.save(booking);

        // Calculate new total amount
        JCB finalJcb = booking.getJcb();
        LocalDate rentalLocal = newRentalDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate returnLocal = newReturnDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        long days = ChronoUnit.DAYS.between(rentalLocal, returnLocal) + 1;
        double totalAmount = finalJcb != null ? finalJcb.getRentalPrice() * days : 0;

        return "Success: Booking updated successfully. New total price: " + totalAmount;
    }


}