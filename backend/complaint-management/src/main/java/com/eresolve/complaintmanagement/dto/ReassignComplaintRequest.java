package com.eresolve.complaintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReassignComplaintRequest {

	private Integer complaintId;
    private String newStaffEmail;

}
