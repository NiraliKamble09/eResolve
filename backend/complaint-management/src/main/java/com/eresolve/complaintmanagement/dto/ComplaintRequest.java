package com.eresolve.complaintmanagement.dto;

import com.eresolve.complaintmanagement.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ComplaintRequest {
    private Integer userId;
    private String title;
    private String description;
    private String category;
    private String media;
    private Status status;

}