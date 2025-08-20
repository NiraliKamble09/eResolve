package com.eresolve.complaintmanagement.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.eresolve.complaintmanagement.dto.ComplaintResponse;
import com.eresolve.complaintmanagement.dto.ComplaintView;
//import com.eresolve.complaintmanagement.enums.Status;

public interface ComplaintService {

        ComplaintResponse createComplaint(Integer userId, String title, String description, String category, String media);

        void deleteComplaintWithMedia(Integer complaintId);

        List<ComplaintView> getComplaintsByStatus(String status, Authentication auth);
        
        List<ComplaintView> getUserComplaints(Integer userId);
   
        
        List<ComplaintView> getAllComplaints();
       
        ComplaintView getComplaintById(Integer complaintId);
        
        List<ComplaintView> getComplaintsByCategory(String category, Authentication auth);



   // List<ComplaintResponse> getComplaintsByStatus(Status status);


}