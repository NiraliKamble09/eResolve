package com.eresolve.complaintmanagement.dto;

import com.eresolve.complaintmanagement.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {
    private Integer userId;
    private String name;
    private String email;
    private Role role; 
}
