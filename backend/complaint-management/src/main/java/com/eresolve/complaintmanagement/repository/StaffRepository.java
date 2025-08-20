package com.eresolve.complaintmanagement.repository;

import com.eresolve.complaintmanagement.entity.UserDetails;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<UserDetails, Integer> {
   
	  Optional<UserDetails> findByEmail(String email);
}
