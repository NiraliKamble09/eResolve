package com.eresolve.complaintmanagement.service;

import com.eresolve.complaintmanagement.dto.UpvoteCount;
import com.eresolve.complaintmanagement.dto.UpvoteResponse;

public interface PublicViewService {
	UpvoteCount getUpvotes(Integer complaintId);
    UpvoteResponse upvoteComplaint(Integer complaintId);
    UpvoteResponse resetUpvotes(Integer complaintId);

}
