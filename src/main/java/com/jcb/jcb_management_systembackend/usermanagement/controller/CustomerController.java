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
    public ResponseEntity<String> bookJCB(
            @RequestParam Long customerId,
            @RequestParam String jcbType,
            @RequestParam String nic,
            @RequestParam String periodOfUse) {
        String result = bookingService.createBooking(customerId, jcbType, nic, periodOfUse);
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}