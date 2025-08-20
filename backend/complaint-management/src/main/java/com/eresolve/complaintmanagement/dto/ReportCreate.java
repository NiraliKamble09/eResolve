package com.eresolve.complaintmanagement.dto;

import com.eresolve.complaintmanagement.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReportCreate {
	  private Integer complaintId;
	    private Integer userId;
	    private String complaintTitle;
	    private Status status;

}
