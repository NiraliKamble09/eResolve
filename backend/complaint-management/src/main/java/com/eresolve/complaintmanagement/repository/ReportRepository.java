package com.eresolve.complaintmanagement.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eresolve.complaintmanagement.entity.Report;
import com.eresolve.complaintmanagement.enums.Status;

public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findByComplaintId(Integer complaintId);
    List<Report> findByUserId(Integer userId);
    List<Report> findByStatus(Status status);
    List<Report> findByGeneratedDateBetween(LocalDateTime start, LocalDateTime end);

}