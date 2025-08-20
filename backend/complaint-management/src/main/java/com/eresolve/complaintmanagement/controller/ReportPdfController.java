package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.entity.Report;
import com.eresolve.complaintmanagement.service.ReportService;
import com.eresolve.complaintmanagement.util.PdfGenerator;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ReportPdfController {

    private final ReportService reportService;

    public ReportPdfController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/reports/pdf")
    public ResponseEntity<byte[]> downloadReportPdf() {
        List<Report> reports = reportService.getAllReports(); // Or filter by user/status/date

        byte[] pdfContent = PdfGenerator.generateReportPdf(reports);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "complaint-report.pdf");

        return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
    }
}