package com.eresolve.complaintmanagement.service;

import com.eresolve.complaintmanagement.dto.UserResponse;
import com.eresolve.complaintmanagement.enums.Role;

import java.util.List;

public interface UserDetailsService {
    UserResponse getUserResponseByEmail(String email);
    List<UserResponse> getUserResponsesByRole(Role role);
}