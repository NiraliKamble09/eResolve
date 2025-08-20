package com.eresolve.complaintmanagement.dto;

import java.time.LocalDateTime;

public interface ReportResponse {
    String getAssignedTo();
    LocalDateTime getResolvedAt();
}
