package com.eresolve.complaintmanagement.entity;

import com.eresolve.complaintmanagement.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_details")
public class UserDetails {
	@Id
	@Column(name = "user_id")
	private int userId;

	    
	    private String name;
	    private String email;

	    @Enumerated(EnumType.STRING)
	    private Role role; 
	 
	    
	    @OneToOne
	    @MapsId	   
	    @JoinColumn(name = "user_id", referencedColumnName = "userId")
	    @JsonIgnore
	    private User user;

}
