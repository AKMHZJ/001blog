package com._blog.Controller;

import com._blog.Entity.User;
import com._blog.Repository.UserRepository;
import com._blog.Repository.PostRepository;
import com._blog.Repository.FollowRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FollowRepository followRepository;

    // Toggle follow/unfollow for the authenticated user towards target userId
    @PostMapping("/{id}/follow")
    public Map<String, Object> toggleFollow(@PathVariable("id") Long targetId,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> resp = new HashMap<>();
        if (userDetails == null) {
            resp.put("error", "Not authenticated");
            return resp;
        }

        User current = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (current == null) {
            resp.put("error", "User not found");
            return resp;
        }

        if (current.getId().equals(targetId)) {
            resp.put("error", "Cannot follow yourself");
            return resp;
        }

        // Check existing follow
        var existing = followRepository.findByFollowerIdAndFolloweeId(current.getId(), targetId);
        boolean following;
        if (existing.isPresent()) {
            // Unfollow
            followRepository.delete(existing.get());
            following = false;
        } else {
            // Follow
            var f = new com._blog.Entity.Follow(current.getId(), targetId);
            followRepository.save(f);
            following = true;
        }

        resp.put("following", following);
        resp.put("targetId", String.valueOf(targetId));
        return resp;
    }

    // Get list of followee ids for current authenticated user
    @GetMapping("/me/following")
    public List<String> getMyFollowing(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return List.of();
        User current = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (current == null) return List.of();
        List<com._blog.Entity.Follow> list = followRepository.findByFollowerId(current.getId());
        List<String> ids = new ArrayList<>();
        for (com._blog.Entity.Follow f : list) ids.add(String.valueOf(f.getFolloweeId()));
        return ids;
    }

    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", String.valueOf(u.getId()));
            entry.put("username", u.getUsername());
            entry.put("name", u.getDisplayName() != null ? u.getDisplayName() : u.getUsername());
            entry.put("bio", u.getBio());
            entry.put("avatar", u.getAvatar());

            // Compute post count using PostRepository helper
            int postCount = postRepository.findByAuthorId(String.valueOf(u.getId())).size();
            entry.put("postCount", postCount);

            result.add(entry);
        }

        return result;
    }
}
