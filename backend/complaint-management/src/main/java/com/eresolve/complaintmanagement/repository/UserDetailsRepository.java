package com.eresolve.complaintmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Role;

public interface UserDetailsRepository extends JpaRepository<UserDetails, Integer>{

	Optional<UserDetails> findByEmail(String email);

	List<UserDetails> findByRole(Role role);

	Optional<UserDetails> findByUserId(Integer userId);

}

