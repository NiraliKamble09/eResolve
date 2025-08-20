package com.eresolve.complaintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email; 
    private String name;
    private String password;
    private String confirmPassword;
    private String role;
}