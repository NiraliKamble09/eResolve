package com.eresolve.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.eresolve.complaintmanagement.enums.Status;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "complaint_id")
    private Integer complaintId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category")
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "media",columnDefinition = "TEXT")
    private String media;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "DATETIME(6)")
    private LocalDateTime updatedAt;
    
    @Column(name = "user_id", nullable = false, insertable = false, updatable = false)
    private Integer userId; // Optional: link with @ManyToOne if User entity is mapped


    @ManyToOne(fetch = FetchType.LAZY) // or EAGER if needed
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserDetails user;


}


