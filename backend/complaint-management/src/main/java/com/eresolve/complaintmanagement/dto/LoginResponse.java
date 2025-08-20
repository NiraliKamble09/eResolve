package com.eresolve.complaintmanagement.dto;

import lombok.*;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String role;

}