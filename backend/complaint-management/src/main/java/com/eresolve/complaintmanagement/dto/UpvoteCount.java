package com.eresolve.complaintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpvoteCount {
    private Integer complaintId;
    private Integer upvotes;
}