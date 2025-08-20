package com.eresolve.complaintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpvoteResponse {
    private Integer complaintId;
    private Integer totalUpvotes;
    private String message;
}
