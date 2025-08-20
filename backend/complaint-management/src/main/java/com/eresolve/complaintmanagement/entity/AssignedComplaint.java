package com.eresolve.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.eresolve.complaintmanagement.enums.Status;

@Entity
@Table(name = "assigned_complaints",uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "complaint_id"}))

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignedComplaint {


	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "id", nullable = false)
	    private Integer id; // ✅ Unique ID for each assignment

	    @Column(name = "user_id", nullable = false)
	    private Integer userId; // ✅ Staff user ID

	    @Column(name = "complaint_id",  nullable = false)
	    private Integer complaintId;

	    @Enumerated(EnumType.STRING)
	    @Column(name = "status")
	    private Status status;

	    @Column(name = "assigned_date")
	    private LocalDateTime assignedDate;

	    @Column(name = "closed_date")
	    private LocalDateTime closedDate;
	    
	    @Column(name = "remark", columnDefinition = "TEXT")
	    private String remark;

	  
	    
	    @ManyToOne(optional = true, fetch = FetchType.LAZY)
	    @JoinColumn(name = "complaint_id", insertable = false, updatable = false)
	    private Complaint complaint;
	    
	}