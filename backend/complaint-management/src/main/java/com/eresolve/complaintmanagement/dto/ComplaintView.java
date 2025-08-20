package com.eresolve.complaintmanagement.dto;

import com.eresolve.complaintmanagement.enums.Status;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ComplaintView {
    private Integer complaintId;
    private String title;
    private String description;
    private String category;
    private Status status;
    private String media;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Flattened user info
    private Integer userId;
    private String userName;
    private String userEmail;
}