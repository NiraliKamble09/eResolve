package com.eresolve.complaintmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eresolve.complaintmanagement.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

}
