package com.eresolve.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.eresolve.complaintmanagement.enums.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "deleted_users")
public class DeletedUser {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    private String name;
    
    @Column(name = "email", nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;
    private String password;
    @Column(name = "deleted_at", nullable = false)
    private LocalDateTime deletedAt;

}