package com.eresolve.complaintmanagement.service;

import com.eresolve.complaintmanagement.dto.AssignedComplaintResponse;
import com.eresolve.complaintmanagement.enums.Status;

import java.util.List;

public interface AssignedComplaintService {
    
    AssignedComplaintResponse updateStatus(Integer id, Status newStatus);
    AssignedComplaintResponse updateStatusWithClosure(Integer id, Status newStatus);
    List<AssignedComplaintResponse> getAllAssigned();
    AssignedComplaintResponse getById(Integer id);
    void delete(Integer id);
}
