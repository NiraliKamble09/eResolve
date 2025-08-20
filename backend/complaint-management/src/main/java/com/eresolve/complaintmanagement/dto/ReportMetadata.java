package com.eresolve.complaintmanagement.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReportMetadata {
    private String assignedTo;
    private LocalDateTime resolvedAt;
}
