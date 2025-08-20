package com.eresolve.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "public_view")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicView {

    @Id
    @Column(name = "complaint_id")
    private Integer complaintId;

    @Column(name = "upvotes")
    private Integer upvotes;
}