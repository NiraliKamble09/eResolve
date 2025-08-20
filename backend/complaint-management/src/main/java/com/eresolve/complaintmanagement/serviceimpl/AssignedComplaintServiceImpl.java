package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.dto.AssignedComplaintResponse;
import com.eresolve.complaintmanagement.entity.AssignedComplaint;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.repository.AssignedComplaintRepository;
import com.eresolve.complaintmanagement.service.AssignedComplaintService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AssignedComplaintServiceImpl implements AssignedComplaintService {

    private static final Logger logger = LoggerFactory.getLogger(AssignedComplaintServiceImpl.class);
    private final AssignedComplaintRepository repository;

    public AssignedComplaintServiceImpl(AssignedComplaintRepository repository) {
        this.repository = repository;
    }

    private AssignedComplaintResponse toResponse(AssignedComplaint entity) {
        logger.debug("Mapping AssignedComplaint entity to response DTO for id {}", entity.getId());
        return new AssignedComplaintResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getComplaintId(),
                entity.getStatus(),
                entity.getAssignedDate(),
                entity.getClosedDate(),
                entity.getRemark()
        );
    }

    @Override
    public AssignedComplaintResponse updateStatus(Integer id, Status newStatus) {
        logger.info("Updating status for assignment id {} to {}", id, newStatus);

        AssignedComplaint assigned = repository.findById(id)
                .orElseThrow(() -> {
                    logger.error("AssignedComplaint not found for id {}", id);
                    return new RuntimeException("AssignedComplaint not found");
                });

        assigned.setStatus(newStatus);
        assigned.setClosedDate(newStatus == Status.RESOLVED ? LocalDateTime.now() : null);

        AssignedComplaint saved = repository.save(assigned);
        logger.info("✅ Status updated successfully for id {}. New status: {}", id, saved.getStatus());

        return toResponse(saved);
    }

    @Override
    public AssignedComplaintResponse updateStatusWithClosure(Integer id, Status newStatus) {
        logger.info("Admin updating status for assignment id {} to {}", id, newStatus);

        AssignedComplaint assigned = repository.findById(id)
                .orElseThrow(() -> {
                    logger.error("AssignedComplaint not found for id {}", id);
                    return new RuntimeException("AssignedComplaint not found");
                });

        assigned.setStatus(newStatus);
        if (newStatus == Status.RESOLVED) {
            assigned.setClosedDate(LocalDateTime.now());
            logger.info("Closed date set for assignment id {} at {}", id, assigned.getClosedDate());
        }

        AssignedComplaint saved = repository.save(assigned);
        logger.info("Admin status update complete for id {}. New status: {}", id, saved.getStatus());

        return toResponse(saved);
    }

    @Override
    public List<AssignedComplaintResponse> getAllAssigned() {
        logger.info("Fetching all assigned complaints");
        List<AssignedComplaint> entities = repository.findAll();
        logger.debug("Total assignments fetched: {}", entities.size());

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public AssignedComplaintResponse getById(Integer id) {
        logger.info("Fetching assignment by id {}", id);

        AssignedComplaint assigned = repository.findById(id)
                .orElseThrow(() -> {
                    logger.error("AssignedComplaint not found for id {}", id);
                    return new RuntimeException("AssignedComplaint not found");
                });

        logger.info("Assignment found for id {}", id);
        return toResponse(assigned);
    }

    @Override
    public void delete(Integer id) {
        logger.warn(" Deleting assignment with id {}", id);
        repository.deleteById(id);
        logger.info("Assignment deleted for id {}", id);
    }
    
   
    
}