package com.eresolve.complaintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardStatsResponse {
	    private long totalComplaints;
	    private long openComplaints;
	    private long inProgress;
	    private long resolved;
	    private long closed;

}
