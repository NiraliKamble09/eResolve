package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.dto.ReportCreate;
import com.eresolve.complaintmanagement.entity.Report;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.service.ReportService;
import com.eresolve.complaintmanagement.util.PdfGenerator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private ReportService reportService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllReports() {
        logger.info("Fetching all reports");
        try {
            List<Report> reports = reportService.getAllReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            logger.error("Failed to fetch reports: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch reports: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Report> createReport(@RequestBody ReportCreate dto) {
        logger.info("Received request to create report for complaintId: {}", dto.getComplaintId());

        try {
            Report savedReport = reportService.createReport(dto);
            return ResponseEntity.ok(savedReport);
        } catch (RuntimeException e) {
            logger.error("Error creating report: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(null); // or return a custom error DTO
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null); // or return a generic error response
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pdf")
    public ResponseEntity<?> exportReportsAsPdf() {
        try {
            List<Report> reports = reportService.getAllReports();
            byte[] pdfBytes = PdfGenerator.generateReportPdf(reports);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=reports.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            logger.error("Failed to generate PDF: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error generating PDF: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or #userId == @jwtUtil.extractUserIdFromToken(#token.replace('Bearer ', ''))")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReportsByUserId(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer userId) {
        logger.info("Fetching reports for userId: {}", userId);
        try {
            List<Report> reports = reportService.getReportsByUserId(userId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            logger.error("Failed to fetch reports: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch reports: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/filter/status/{status}")
    public ResponseEntity<?> getReportsByStatus(@PathVariable Status status) {
        try {
            List<Report> reports = reportService.getReportsByStatus(status);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/download-report")
    public ResponseEntity<byte[]> downloadReportPdf() {
        List<Report> reports = reportService.getAllReports();
        byte[] pdf = PdfGenerator.generateReportPdf(reports);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "complaint-report.pdf");

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/filter/dates")
    public ResponseEntity<?> getReportsByDateRange(
            @RequestParam String start,
            @RequestParam String end) {
        try {
            LocalDateTime startDate = LocalDateTime.parse(start);
            LocalDateTime endDate = LocalDateTime.parse(end);
            List<Report> reports = reportService.getReportsByDateRange(startDate, endDate);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}