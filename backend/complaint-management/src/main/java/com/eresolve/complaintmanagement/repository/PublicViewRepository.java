package com.eresolve.complaintmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eresolve.complaintmanagement.entity.PublicView;

public interface PublicViewRepository  extends JpaRepository<PublicView, Integer> {
	
	 int countByComplaintId(Integer complaintId);

}