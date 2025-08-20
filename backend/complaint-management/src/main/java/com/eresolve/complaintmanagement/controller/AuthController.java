package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.dto.LoginRequest;
import com.eresolve.complaintmanagement.dto.RegisterRequest;
import com.eresolve.complaintmanagement.dto.LoginResponse;
import com.eresolve.complaintmanagement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request); // contains token + role
            return ResponseEntity.ok(response); //returns token in JSON body
        } catch (Exception e) {
            return ResponseEntity.status(403).body("Login failed: " + e.getMessage());
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            LoginRequest loginRequest = new LoginRequest(request.getEmail(), request.getPassword());

            //Pass name along with role
            authService.register(loginRequest, request.getName(), request.getRole().toUpperCase());

            return ResponseEntity.ok("User registered with role: " + request.getRole());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

}





