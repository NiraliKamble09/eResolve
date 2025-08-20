package com.eresolve.complaintmanagement.dto;

import com.eresolve.complaintmanagement.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatusUpdateRequest {
    private Status status;

}