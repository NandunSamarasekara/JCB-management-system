package com.jcb.jcb_management_systembackend.usermanagement.controller;

import com.jcb.jcb_management_systembackend.usermanagement.model.User;
import com.jcb.jcb_management_systembackend.usermanagement.service.UserService;
import com.jcb.jcb_management_systembackend.bookingmanagement.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register/customer")
    public ResponseEntity<String> registerCustomer(@RequestBody Customer customer) {
        try {
            String result = userService.registerCustomer(customer);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginUser) {
        try {
            String result = userService.login(loginUser.getEmail(), loginUser.getPassword());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}