package com.eresolve.complaintmanagement.dto;

import java.time.LocalDateTime;

import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Status;
import lombok.*;

@Getter
@AllArgsConstructor
public class ComplaintResponse {
	 private Integer complaintId;
	    private String title;
	    private String description;
	    private String category;
	    private Status status;
	    private String media;
	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;
	    private UserDetails user;
}
