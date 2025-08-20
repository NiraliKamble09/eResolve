package com.eresolve.complaintmanagement.dto;

import java.time.LocalDateTime;

import com.eresolve.complaintmanagement.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AssignedComplaintResponse {
	 private Integer id;
	    private Integer userId;
	    private Integer complaintId;
	    private Status status;
	    private LocalDateTime assignedDate;
	    private LocalDateTime closedDate;
	    private String remark;

}
