package com.jcb.jcb_management_systembackend.usermanagement.controller;

import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.bookingmanagement.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                request.getCustomerId(),
                request.getJcbType(),
                request.getNic(),
                request.getPeriodOfUse(),
                request.getRegisteredNumber(),
                request.getDriverId()
        );
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // DTO for request body
    public static class BookJCBRequest {
        private Long customerId;
        private String jcbType;
        private String nic;
        private String periodOfUse;
        private String registeredNumber;
        private Long driverId;

        public Long getCustomerId() {
            return customerId;
        }

        public void setCustomerId(Long customerId) {
            this.customerId = customerId;
        }

        public String getJcbType() {
            return jcbType;
        }

        public void setJcbType(String jcbType) {
            this.jcbType = jcbType;
        }

        public String getNic() {
            return nic;
        }

        public void setNic(String nic) {
            this.nic = nic;
        }

        public String getPeriodOfUse() {
            return periodOfUse;
        }

        public void setPeriodOfUse(String periodOfUse) {
            this.periodOfUse = periodOfUse;
        }

        public String getRegisteredNumber() {
            return registeredNumber;
        }

        public void setRegisteredNumber(String registeredNumber) {
            this.registeredNumber = registeredNumber;
        }

        public Long getDriverId() {
            return driverId;
        }

        public void setDriverId(Long driverId) {
            this.driverId = driverId;
        }
    }
}