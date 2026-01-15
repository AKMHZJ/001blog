package com._blog.Controller;

import com._blog.Entity.Post;
import com._blog.Entity.Comment;
import com._blog.Entity.User;
import com._blog.Repository.PostRepository;
import com._blog.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import com._blog.Repository.FollowRepository;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular to connect
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    // 1. Get All Posts (Feed)
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByDateDesc();
    }

        // 9. Get feed for current user (their posts + posts from users they follow)
        @GetMapping("/feed")
        public List<Post> getFeed(@AuthenticationPrincipal UserDetails userDetails) {
            if (userDetails == null) {
                // If not authenticated, return global feed
                return postRepository.findAllByOrderByDateDesc();
            }

            // Find current user
            User currentUser = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (currentUser == null) {
                return postRepository.findAllByOrderByDateDesc();
            }

            // Find followees (followRepository is autowired below)
            // Build list of author ids (include current user)
            List<String> authorIds = new ArrayList<>();
            authorIds.add(String.valueOf(currentUser.getId()));

            // If FollowRepository is available, add followees
            try {
                // Autowire FollowRepository via field (added below)
                List<com._blog.Entity.Follow> followList = followRepository.findByFollowerId(currentUser.getId());
                for (com._blog.Entity.Follow f : followList) {
                    authorIds.add(String.valueOf(f.getFolloweeId()));
                }
            } catch (Exception ignored) {}

            return postRepository.findByAuthorIdIn(authorIds);
        }

    // 2. Get Single Post
    @GetMapping("/{id}")
    public Post getPost(@PathVariable String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // 3. Get User's Posts (My Blog)
    @GetMapping("/user/{userId}")
    public List<Post> getUserPosts(@PathVariable String userId) {
        return postRepository.findByAuthorId(userId);
    }

    // 4. Create Post
    @PostMapping
    public Post createPost(@RequestBody PostRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        // Find the user who is currently logged in
        User author = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setTitle(request.title);
        post.setExcerpt(request.excerpt);
        post.setCategory(request.category);
        post.setImage(request.image);
        post.setContentList(request.content); // Helper method converts List to String
        post.setDate(LocalDateTime.now());
        post.setAuthor(author);

        return postRepository.save(post);
    }

    // 5. Toggle Like
    @PostMapping("/{id}/like")
    public Post toggleLike(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        Post post = postRepository.findById(id).orElseThrow();
        User currentUser = userRepository.findByUsername(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));

        String currentUserId = String.valueOf(currentUser.getId());

        if (post.getLikes().contains(currentUserId)) {
            post.getLikes().remove(currentUserId);
        } else {
            post.getLikes().add(currentUserId);
        }

        return postRepository.save(post);
    }

    // 6. Add Comment
    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable String id, @RequestBody CommentRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        Post post = postRepository.findById(id).orElseThrow();
        User author = userRepository.findByUsername(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setText(request.text);
        comment.setTimestamp(LocalDateTime.now());
        comment.setAuthor(author);
        
        // Save comment implicitly by adding to post list (thanks to CascadeType.ALL)
        post.getComments().add(comment);
        postRepository.save(post);
        
        return comment;
    }
    
    // 7. Delete Post
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        postRepository.deleteById(id);
    }

    // 8. Update Post
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable String id, @RequestBody PostRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));

        // Only allow the author to update
        User currentUser = userRepository.findByUsername(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to edit this post");
        }

        post.setTitle(request.title);
        post.setExcerpt(request.excerpt);
        post.setCategory(request.category);
        post.setImage(request.image);
        post.setContentList(request.content);

        return postRepository.save(post);
    }

    // Helper DTO Classes for requests
    static class PostRequest {
        public String title;
        public String excerpt;
        public String category;
        public String image;
        public List<String> content;
    }

    static class CommentRequest {
        public String text;
    }
}