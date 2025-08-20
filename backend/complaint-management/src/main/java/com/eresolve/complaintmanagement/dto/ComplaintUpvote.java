package com.eresolve.complaintmanagement.dto;

import java.time.LocalDateTime;

import com.eresolve.complaintmanagement.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ComplaintUpvote {

	private Integer complaintId;
    private String title;
    private String description;
    private String category;
    private Status status;
    private String media;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer userId;

    private Integer upvotes; // 🆕 Add this field

}
