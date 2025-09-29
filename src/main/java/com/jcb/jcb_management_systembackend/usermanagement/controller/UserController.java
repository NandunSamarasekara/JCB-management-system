package com.jcb.jcb_management_systembackend.usermanagement.controller;

import com.jcb.jcb_management_systembackend.usermanagement.model.User;
import com.jcb.jcb_management_systembackend.usermanagement.model.UserRole;
import com.jcb.jcb_management_systembackend.usermanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam UserRole role) {
        String result = userService.registerUser(firstName, lastName, email, password, role);
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestParam String email,
            @RequestParam String password) {
        Optional<User> userOpt = userService.loginUser(email, password);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(new LoginResponse(user.getId(), user.getEmail(), user.getRole()));
        } else {
            return ResponseEntity.badRequest().body("Error: Invalid email or password");
        }
    }

    // Inner class for login response
    static class LoginResponse {
        private Long id;
        private String email;
        private UserRole role;

        public LoginResponse(Long id, String email, UserRole role) {
            this.id = id;
            this.email = email;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public UserRole getRole() {
            return role;
        }
    }
}