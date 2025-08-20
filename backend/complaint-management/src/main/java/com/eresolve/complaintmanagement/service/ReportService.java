package com.eresolve.complaintmanagement.service;

import com.eresolve.complaintmanagement.dto.ReportCreate;
import com.eresolve.complaintmanagement.entity.Report;
import com.eresolve.complaintmanagement.enums.Status;

import java.time.LocalDateTime;
import java.util.List;

public interface ReportService {

    List<Report> getAllReports();

    List<Report> getReportsByComplaintId(Integer complaintId);

    List<Report> getReportsByUserId(Integer userId);


    List<Report> getReportsByStatus(Status status);

    List<Report> getReportsByDateRange(LocalDateTime start, LocalDateTime end);

	Report createReport(ReportCreate dto);
}