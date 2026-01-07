package com._blog.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com._blog.Entity.User;
import com._blog.Repository.UserRepository;
import com._blog.Security.JwtTokenProvider;

// import com._blog.Service.AuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com._blog.dto.LoginRequest;
import java.util.Map;

import java.util.HashMap;
import java.util.Optional;
// import com._blog.Repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // Allows Angular to connect
public class AuthController {

    // @Autowired
    // private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
private JwtTokenProvider tokenProvider; // Inject your new provider

   @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        System.out.println("--- RECEIVED SIGNUP REQUEST ---");
        System.out.println("Email: " + user.getEmail());
        System.out.println("Username: " + user.getUsername());
        System.out.println("Password: " + user.getPassword());
        System.out.println("-------------------------------");

        try {
            // 1. Check if user exists
            if (userRepository.existsByUsername(user.getUsername())) {
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }

            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }

            // 2. Encrypt the password
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // 3. Save using the correct JPA method: .save()
            User savedUser = userRepository.save(user);
            
            System.out.println("SUCCESS: User saved with ID: " + savedUser.getId());
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            System.err.println("CRITICAL ERROR: " + e.getMessage());
            e.printStackTrace(); 
            return ResponseEntity.internalServerError().body("Server Error: " + e.getMessage());
        }
        // if(userRepository.existsByUsername(user.getUsername())) {
        //     return ResponseEntity.badRequest().body("Username is already taken!");
        // }
        // if(userRepository.existsByEmail(user.getEmail())) {
        //     return ResponseEntity.badRequest().body("Email is already in use!");
        // }

        // // For now, we save as plain text. We will add BCrypt encryption in the next step!
        // User savedUser = userRepository.save(user);
        // return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {

        System.out.println("DEBUG: Username received: [" + loginRequest.getUsername() + "]");
        System.out.println("DEBUG: Password received: [" + loginRequest.getPassword() + "]");
        // 1. Find user by username
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 2. Check if the typed password matches the encoded password in DB
            // if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            boolean isMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        
        System.out.println("DEBUG: Password Match Result: " + isMatch);

        if (isMatch) {
                
                // Generate the Token
                String token = tokenProvider.generateToken(user.getUsername());

                // Create a response map (or a DTO)
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("username", user.getUsername());
                response.put("displayName", user.getDisplayName());
                // response.put("email", user.getEmail());
                
                // For now, return the user info (We will add JWT tokens next)
                System.out.println("Login Successful for: " + user.getUsername());
                return ResponseEntity.ok(response); 
            }
        }

        // 3. If user not found or password wrong
        return ResponseEntity.status(401).body("Invalid credentials");
    }

}
