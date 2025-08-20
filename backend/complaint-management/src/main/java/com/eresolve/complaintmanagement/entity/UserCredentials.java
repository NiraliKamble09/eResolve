package com.eresolve.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

//import java.util.List;

@Entity
@Table(name = "user_credentials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCredentials {

    @Id
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;
}