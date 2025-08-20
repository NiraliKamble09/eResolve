package com.eresolve.complaintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StaffDashboardResponse {
    private int totalAssigned;
    private int resolved;
    private int inProgress;
    private int open;
}
