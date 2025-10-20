package com.jcb.jcb_management_systembackend.bookingmanagement.controller;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import com.jcb.jcb_management_systembackend.bookingmanagement.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create a new booking
    @PostMapping
    public ResponseEntity<String> createBooking(@RequestBody CreateBookingRequest request) {
        String result = bookingService.createBooking(
            request.getCustomerNic(),
            request.getJcbType(),
            request.getRentalDate(),
            request.getReturnDate(),
            request.isAcceptPrice(),
            request.isAcceptTerms(),
            request.getPaymentMethod()
        );
        return ResponseEntity.ok(result);
    }

    // Get all bookings for a customer
    @GetMapping("/customer/{customerNic}")
    public ResponseEntity<List<Booking>> getBookingsByCustomer(@PathVariable String customerNic) {
        List<Booking> bookings = bookingService.getBookingsByCustomer(customerNic);
        return ResponseEntity.ok(bookings);
    }

    // Delete a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        boolean deleted = bookingService.deleteBooking(id);
        if (deleted) {
            return ResponseEntity.ok("Booking deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to delete booking");
        }
    }

    // Update a booking
    @PutMapping("/{id}")
    public ResponseEntity<String> updateBooking(@PathVariable Long id, @RequestBody UpdateBookingRequest request) {
        String result = bookingService.updateBooking(
            id,
            request.getJcbType(),
            request.getRentalDate(),
            request.getReturnDate()
        );
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // DTO for request body
    public static class CreateBookingRequest {
        private String customerNic;
        private String jcbType;
        private java.util.Date rentalDate;
        private java.util.Date returnDate;
        private boolean acceptPrice;
        private boolean acceptTerms;
        private String paymentMethod;

        // Getters and setters
        public String getCustomerNic() {
            return customerNic;
        }

        public void setCustomerNic(String customerNic) {
            this.customerNic = customerNic;
        }

        public String getJcbType() {
            return jcbType;
        }

        public void setJcbType(String jcbType) {
            this.jcbType = jcbType;
        }

        public java.util.Date getRentalDate() {
            return rentalDate;
        }

        public void setRentalDate(java.util.Date rentalDate) {
            this.rentalDate = rentalDate;
        }

        public java.util.Date getReturnDate() {
            return returnDate;
        }

        public void setReturnDate(java.util.Date returnDate) {
            this.returnDate = returnDate;
        }

        public boolean isAcceptPrice() {
            return acceptPrice;
        }

        public void setAcceptPrice(boolean acceptPrice) {
            this.acceptPrice = acceptPrice;
        }

        public boolean isAcceptTerms() {
            return acceptTerms;
        }

        public void setAcceptTerms(boolean acceptTerms) {
            this.acceptTerms = acceptTerms;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
    }

    // DTO for update booking request
    public static class UpdateBookingRequest {
        private String jcbType;
        private java.util.Date rentalDate;
        private java.util.Date returnDate;

        public String getJcbType() {
            return jcbType;
        }

        public void setJcbType(String jcbType) {
            this.jcbType = jcbType;
        }

        public java.util.Date getRentalDate() {
            return rentalDate;
        }

        public void setRentalDate(java.util.Date rentalDate) {
            this.rentalDate = rentalDate;
        }

        public java.util.Date getReturnDate() {
            return returnDate;
        }

        public void setReturnDate(java.util.Date returnDate) {
            this.returnDate = returnDate;
        }
    }
}