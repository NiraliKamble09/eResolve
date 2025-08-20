package com.eresolve.complaintmanagement.dto;


import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AssignComplaintRequest {
	
	    private Integer complaintId;

	    private Integer userId;

	    private LocalDateTime assignedDate;
	    
	    // Optional alias for semantic clarity
	    public Integer getStaffId() {
	        return userId;
	    }
}
