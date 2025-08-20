package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.config.JwtUtil;
import com.eresolve.complaintmanagement.dto.LoginRequest;
import com.eresolve.complaintmanagement.dto.LoginResponse;
import com.eresolve.complaintmanagement.entity.User;
import com.eresolve.complaintmanagement.entity.UserCredentials;
import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Role;
import com.eresolve.complaintmanagement.repository.UserCredentialsRepository;
import com.eresolve.complaintmanagement.repository.UserDetailsRepository;
import com.eresolve.complaintmanagement.repository.UserRepository;
import com.eresolve.complaintmanagement.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private UserRepository usersRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private UserCredentialsRepository userCredentialsRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public String authenticateUser(String email, String password) {
        return authenticate(email, password, Role.USER);
    }

    @Override
    public String authenticateAdmin(String email, String password) {
        return authenticate(email, password, Role.ADMIN);
    }

    @Override
    public String authenticateStaff(String email, String password) {
        return authenticate(email, password, Role.STAFF);
    }

    @Override
    public String getUserRole(String email) {
        return userDetailsRepository.findByEmail(email)
                .map(user -> user.getRole().name()) // ✅ use name()
                .orElse("UNKNOWN");
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        logger.info("[Login] Attempting login for email: {}", request.getEmail());

        UserCredentials credentials = userCredentialsRepository.findById(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), credentials.getPassword())) {
            logger.error("[Login] Password mismatch for email: {}", request.getEmail());
            throw new RuntimeException("Invalid credentials");
        }

        UserDetails details = userDetailsRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User details not found"));

        logger.info("[Login] Successful for email: {}", request.getEmail());

        String token = jwtUtil.generateToken(request.getEmail(), details.getRole().name()); // ✅ use name()
        return new LoginResponse(token, details.getRole().name()); // ✅ return both token and role
    }
    

    @Override
    public void register(LoginRequest request,String name, String upperCaseRole) {
        logger.info("[Register] Registering user with role {}: {}", upperCaseRole, request.getEmail());

        if (userCredentialsRepository.existsById(request.getEmail())) {
            throw new RuntimeException("User already exists");
        }

        Role role = Role.fromString(upperCaseRole); 

        User user = new User();
        user = usersRepository.save(user);

        UserDetails details = new UserDetails();
        details.setEmail(request.getEmail());
        details.setName(name);
        details.setRole(role);
        details.setUser(user);
        userDetailsRepository.save(details);

        UserCredentials credentials = new UserCredentials();
        credentials.setEmail(request.getEmail());
        credentials.setPassword(passwordEncoder.encode(request.getPassword()));
        userCredentialsRepository.save(credentials);

        logger.info("[Register] Successfully registered user with role {}: {}", role.name(), request.getEmail());
    }

    private String authenticate(String email, String password, Role expectedRole) {
        logger.info("[Auth] Authenticating email: {} with expected role: {}", email, expectedRole);

        UserCredentials credentials = userCredentialsRepository.findById(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, credentials.getPassword())) {
            logger.error("[Auth] Password mismatch for email: {}", email);
            throw new RuntimeException("Invalid credentials");
        }

        UserDetails details = userDetailsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User details not found"));

        if (details.getRole() != expectedRole) {
            logger.error("[Auth] Role mismatch for email: {}. Expected: {}, Found: {}", email, expectedRole, details.getRole());
            throw new RuntimeException("Invalid role");
        }

        logger.info("[Auth] Authentication successful for email: {}", email);
        return jwtUtil.generateToken(email, details.getRole().name()); 
    }
}