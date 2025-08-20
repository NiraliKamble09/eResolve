package com.eresolve.complaintmanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardView {
    private int totalComplaints;
    private int inProgressCount;
    private int resolvedCount;
    private int openCount;
    private List<ComplaintUserView> recentComplaints;
}