package com._blog.Controller;

import org.springframework.http.ResponseEntity;
import com._blog.Entity.User;
import com._blog.Repository.UserRepository;
// import com._blog.Service.AuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
// import com._blog.Repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // Allows Angular to connect
public class AuthController {

    // @Autowired
    // private AuthService authService;

    @Autowired
    private UserRepository userRepository;

   @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if(userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }
        if(userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        // For now, we save as plain text. We will add BCrypt encryption in the next step!
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
