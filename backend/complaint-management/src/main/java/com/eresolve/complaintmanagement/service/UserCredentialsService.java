package com.eresolve.complaintmanagement.service;

import com.eresolve.complaintmanagement.entity.UserCredentials;

import java.util.List;

public interface UserCredentialsService {

    List<UserCredentials> getAll();
    void delete(String email);
}