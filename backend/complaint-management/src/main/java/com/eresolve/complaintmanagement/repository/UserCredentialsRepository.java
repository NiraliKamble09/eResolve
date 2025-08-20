package com.eresolve.complaintmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eresolve.complaintmanagement.entity.UserCredentials;

import jakarta.transaction.Transactional;

public interface UserCredentialsRepository extends JpaRepository<UserCredentials, String> {
	 @Transactional
	    @Modifying
	    @Query("DELETE FROM UserCredentials u WHERE LOWER(u.email) = LOWER(:email)")
	    void deleteByEmail(@Param("email") String email);
	   
	    boolean existsByEmail(String email);
	    UserCredentials findByEmailAndPassword(String email, String password);
	}
