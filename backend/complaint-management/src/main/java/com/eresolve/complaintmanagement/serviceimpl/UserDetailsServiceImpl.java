package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.dto.UserResponse;
import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Role;
import com.eresolve.complaintmanagement.repository.UserDetailsRepository;
import com.eresolve.complaintmanagement.service.UserDetailsService;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserDetailsRepository repository;

    public UserDetailsServiceImpl(UserDetailsRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserResponse getUserResponseByEmail(String email) {
        UserDetails userDetails = repository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new UserResponse(
            userDetails.getUserId(),
            userDetails.getName(),
            userDetails.getEmail(),
            userDetails.getRole()
        );
    }

    @Override
    public List<UserResponse> getUserResponsesByRole(Role role) {
        return repository.findByRole(role).stream()
            .map(userDetails -> new UserResponse(
                userDetails.getUserId(),
                userDetails.getName(),
                userDetails.getEmail(),
                userDetails.getRole()
            ))
            .toList();
    }
}