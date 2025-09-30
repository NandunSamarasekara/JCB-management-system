package com.jcb.jcb_management_systembackend.usermanagement.controller;

import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.bookingmanagement.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard() {
        return ResponseEntity.ok("Welcome to Customer Dashboard. Use /api/jcbs/available to view JCBs and /api/customer/book to book a JCB.");
    }

    @GetMapping("/jcbs/available")
    public ResponseEntity<List<JCB>> getAvailableJCBs() {
        return ResponseEntity.ok(bookingService.getAvailableJCBs());
    }

    @PostMapping("/book")
    public ResponseEntity<String> bookJCB(@RequestBody BookJCBRequest request) {
        String result = bookingService.createBooking(
                request.getCustomerNic(),
                request.getJcbType(),
                request.getRentalDate(),
                request.getReturnDate(),
                request.isAcceptPrice(),
                request.isAcceptTerms()
        );
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // DTO for request body
    public static class BookJCBRequest {
        private String customerNic;
        private String jcbType;
        private Date rentalDate;
        private Date returnDate;
        private boolean acceptPrice;
        private boolean acceptTerms;

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

        public Date getRentalDate() {
            return rentalDate;
        }

        public void setRentalDate(Date rentalDate) {
            this.rentalDate = rentalDate;
        }

        public Date getReturnDate() {
            return returnDate;
        }

        public void setReturnDate(Date returnDate) {
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
    }
}