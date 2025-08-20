package com.eresolve.complaintmanagement.dto;

import com.eresolve.complaintmanagement.enums.Status;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ComplaintUserView {

    private Integer complaintId;
    private String title;
    private String description;
    private String category;
    private Status status;
    private String mediaUrl; // Optional: image or file preview
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer upvoteCount;
    private Boolean userHasUpvoted; // true if current user already upvoted
    
    private String remark;
    
}