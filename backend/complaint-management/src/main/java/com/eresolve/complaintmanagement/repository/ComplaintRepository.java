package com.eresolve.complaintmanagement.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eresolve.complaintmanagement.dto.ReportResponse;
import com.eresolve.complaintmanagement.entity.Complaint;
import com.eresolve.complaintmanagement.enums.Status;

public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {
    List<Complaint> findByUserId(Integer userId);
    List<Complaint> findByStatus(Status status);
    Optional<Complaint> findByComplaintId(Integer complaintId);
    
    @Modifying
    @Query(value = "UPDATE complaint SET remarks = :remarks, updated_at = :updatedAt WHERE complaint_id = :id", nativeQuery = true)
    void updateRemarks(@Param("id") Integer id, @Param("remarks") String remarks, @Param("updatedAt") LocalDateTime updatedAt);
	long countByStatus(Status status);

	List<Complaint> findByStatusAndCategory(Status status, String category);
	List<Complaint> findByUserIdAndStatus(Integer userId, Status status);
	
	List<Complaint> findByCategoryIgnoreCase(String category);
	List<Complaint> findByUserIdAndCategoryIgnoreCase(Integer userId, String category);
	List<Complaint> findByUserIdAndCategory(int userId, String category);

	
	@Query(value = "SELECT c.user_id AS assignedTo, c.updated_at AS resolvedAt FROM complaints c WHERE c.complaint_id = :id", nativeQuery = true)
	Optional<ReportResponse> findReportMetadataById(@Param("id") Integer id);
}



