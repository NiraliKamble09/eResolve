package com.eresolve.complaintmanagement.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.eresolve.complaintmanagement.entity.DeletedUser;

import java.util.Optional;

public interface DeletedUserRepository extends JpaRepository<DeletedUser, Integer> {
    
    boolean existsByUserId(Integer userId);
    
    Optional<DeletedUser> findByUserId(Integer userId);
    
    boolean existsByEmail(String email);
    
    void deleteByUserId(Integer userId);
}
