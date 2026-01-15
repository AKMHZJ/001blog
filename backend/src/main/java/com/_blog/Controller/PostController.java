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

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular to connect
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Get All Posts (Feed)
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByDateDesc();
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