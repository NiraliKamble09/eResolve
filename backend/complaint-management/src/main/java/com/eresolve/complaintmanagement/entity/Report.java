package com.eresolve.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.eresolve.complaintmanagement.enums.Status;


@Data // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @Column(name = "generated_date", nullable = false)
    private LocalDateTime generatedDate;

    @Column(name = "complaint_id", nullable = false)
    private Integer complaintId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    private String complaintTitle;
    @Enumerated(EnumType.STRING)
    private Status status;
    private LocalDateTime resolvedAt;
    private String assignedTo;

}