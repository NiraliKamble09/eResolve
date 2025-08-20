package com.eresolve.complaintmanagement.enums;

public enum Role {
	  USER, ADMIN, STAFF;
	  
	  public static Role fromString(String value) {
	        for (Role role : Role.values()) {
	            if (role.name().equalsIgnoreCase(value)) {
	                return role;
	            }
	        }
	        throw new IllegalArgumentException("Invalid role: " + value);
	    }

	}
