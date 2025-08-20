package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.dto.UpvoteCount;
import com.eresolve.complaintmanagement.dto.UpvoteResponse;
import com.eresolve.complaintmanagement.entity.PublicView;
import com.eresolve.complaintmanagement.repository.PublicViewRepository;
import com.eresolve.complaintmanagement.service.PublicViewService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class PublicViewServiceImpl implements PublicViewService {

    private static final Logger logger = LoggerFactory.getLogger(PublicViewServiceImpl.class);
    private final PublicViewRepository publicViewRepo;

    public PublicViewServiceImpl(PublicViewRepository publicViewRepo) {
        this.publicViewRepo = publicViewRepo;
    }

    private String getCurrentUserRole() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_ANONYMOUS");
    }

    @Override
    public UpvoteCount getUpvotes(Integer complaintId) {
        String role = getCurrentUserRole();
        logger.info("[{}] Fetching upvotes for complaintId: {}", role, complaintId);

        int count = publicViewRepo.findById(complaintId)
            .map(PublicView::getUpvotes)
            .orElse(0);

        logger.debug("Upvotes for complaintId {}: {}", complaintId, count);
        return new UpvoteCount(complaintId, count);
    }

    @Override
    public UpvoteResponse upvoteComplaint(Integer complaintId) {
        String role = getCurrentUserRole();
        logger.info("[{}] Upvoting complaintId: {}", role, complaintId);

        PublicView pv = publicViewRepo.findById(complaintId)
            .orElse(new PublicView(complaintId, 0));

        pv.setUpvotes(pv.getUpvotes() + 1);
        publicViewRepo.save(pv);

        logger.debug("ComplaintId {} now has {} upvotes", complaintId, pv.getUpvotes());
        return new UpvoteResponse(complaintId, pv.getUpvotes(), "Upvote successful");
    }

    @Override
    public UpvoteResponse resetUpvotes(Integer complaintId) {
        String role = getCurrentUserRole();
        logger.warn("[{}] Resetting upvotes for complaintId: {}", role, complaintId);

        PublicView pv = publicViewRepo.findById(complaintId)
            .orElse(new PublicView(complaintId, 0));

        pv.setUpvotes(0);
        publicViewRepo.save(pv);

        logger.info("Upvotes reset for complaintId {} by [{}]", complaintId, role);
        return new UpvoteResponse(complaintId, 0, "Upvotes reset successfully");
    }
}