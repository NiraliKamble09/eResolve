package com.eresolve.complaintmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eresolve.complaintmanagement.dto.AssignedComplaintResponse;
import com.eresolve.complaintmanagement.entity.AssignedComplaint;

public interface AssignedComplaintRepository extends JpaRepository<AssignedComplaint, Integer> {
    List<AssignedComplaint> findByUserId(Integer userId);
    Optional<AssignedComplaint> findByComplaintId(Integer complaintId);
    boolean existsByComplaintId(Integer complaintId);
    
    @Query("SELECT new com.eresolve.complaintmanagement.dto.AssignedComplaintResponse(ac.id, ac.userId, ac.complaintId, ac.status, ac.assignedDate, ac.closedDate, ac.remark) FROM AssignedComplaint ac WHERE ac.userId = :userId")
    List<AssignedComplaintResponse> findAssignmentsByUserId(@Param("userId") Integer userId);
	Optional<AssignedComplaint> findByComplaintIdAndUserId(Integer complaintId, Integer userId);

	
}
