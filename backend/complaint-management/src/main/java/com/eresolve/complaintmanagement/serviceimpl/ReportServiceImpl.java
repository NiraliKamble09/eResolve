package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.dto.ReportCreate;
import com.eresolve.complaintmanagement.dto.ReportMetadata;
import com.eresolve.complaintmanagement.dto.ReportResponse;
import com.eresolve.complaintmanagement.entity.Report;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.repository.ComplaintRepository;
import com.eresolve.complaintmanagement.repository.ReportRepository;
import com.eresolve.complaintmanagement.service.ReportService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportServiceImpl.class);

    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private ComplaintRepository complaintRepository;


    @Override
    public List<Report> getAllReports() {
        logger.info("Fetching all reports");
        return reportRepository.findAll();
    }

    @Override
    public List<Report> getReportsByComplaintId(Integer complaintId) {
        logger.info("Fetching reports for complaintId: {}", complaintId);
        return reportRepository.findByComplaintId(complaintId);
    }

    @Override
    public List<Report> getReportsByUserId(Integer userId) {
        logger.info("Fetching reports for userId: {}", userId);
        return reportRepository.findByUserId(userId);
    }


    @Override
    public List<Report> getReportsByStatus(Status status) {
        logger.info("Fetching reports with status: {}", status);
        return reportRepository.findByStatus(status);
    }

    @Override
    public List<Report> getReportsByDateRange(LocalDateTime start, LocalDateTime end) {
        logger.info("Fetching reports between {} and {}", start, end);
        return reportRepository.findByGeneratedDateBetween(start, end);
    }

    
    @Override
    public Report createReport(ReportCreate dto) {
        logger.info("Creating report from DTO for complaintId: {}", dto.getComplaintId());

        ReportMetadata metadata = getReportMetadata(dto.getComplaintId());

        Report report = new Report();
        report.setComplaintId(dto.getComplaintId());
        report.setUserId(dto.getUserId());
        report.setComplaintTitle(dto.getComplaintTitle());
        report.setStatus(dto.getStatus());

        report.setGeneratedDate(LocalDateTime.now());
        report.setResolvedAt(metadata.getResolvedAt());
        report.setAssignedTo(metadata.getAssignedTo());

        return reportRepository.save(report);
    }

   
    private ReportMetadata getReportMetadata(Integer complaintId) {
        ReportResponse response = complaintRepository.findReportMetadataById(complaintId)
            .orElseThrow(() -> new RuntimeException("Complaint metadata not found"));

        return new ReportMetadata(
            response.getAssignedTo(),
            response.getResolvedAt()
        );
    }
}    