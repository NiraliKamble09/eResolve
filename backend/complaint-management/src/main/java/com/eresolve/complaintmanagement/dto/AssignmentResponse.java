package com.eresolve.complaintmanagement.dto;

import java.time.LocalDateTime;

import com.eresolve.complaintmanagement.enums.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AssignmentResponse {
	    private Integer complaintId;
	    
	    @JsonIgnore
	    private Integer userId;
	    private Status status;
	    private String assignedBy;
	    private LocalDateTime assignedAt;

	    @JsonProperty("staffId")
	    public Integer getStaffId() {
	        return userId;
	    }

}
