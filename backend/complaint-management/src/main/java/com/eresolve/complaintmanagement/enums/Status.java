package com.eresolve.complaintmanagement.enums;

public enum Status {
	OPEN, IN_PROGRESS, RESOLVED,  CLOSED;
	
	 public static Status fromString(String value) {
        return Status.valueOf(value.toUpperCase());
    }

}
