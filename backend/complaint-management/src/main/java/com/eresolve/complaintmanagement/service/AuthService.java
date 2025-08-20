package com.eresolve.complaintmanagement.service;

import com.eresolve.complaintmanagement.dto.LoginRequest;
import com.eresolve.complaintmanagement.dto.LoginResponse;

public interface AuthService {
    String authenticateUser(String email, String password);
    String authenticateAdmin(String email, String password);
    String authenticateStaff(String email, String password);
    String getUserRole(String email);
 
    LoginResponse login(LoginRequest request); 
    
    void register(LoginRequest request, String name, String role);  // Unified register
}