package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.entity.UserCredentials;
import com.eresolve.complaintmanagement.repository.UserCredentialsRepository;
import com.eresolve.complaintmanagement.service.UserCredentialsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserCredentialsServiceImpl implements UserCredentialsService {

    private static final Logger logger = LoggerFactory.getLogger(UserCredentialsServiceImpl.class);

    private final UserCredentialsRepository repository;

    public UserCredentialsServiceImpl(UserCredentialsRepository repository) {
        this.repository = repository;
    }


    @Override
    public List<UserCredentials> getAll() {
        logger.info("Fetching all user credentials");
        return repository.findAll();
    }

    @Override
    public void delete(String email) {
        logger.warn("Deleting credentials for email: {}", email);
        repository.deleteById(email);
    }
}