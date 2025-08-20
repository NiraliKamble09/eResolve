package com.eresolve.complaintmanagement.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class StaffResponse {
	
	@JsonProperty("staffId")
    private Integer userId;
    private String name;
    private String email;

}
