package com._blog.Repository;

import com._blog.Entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {
    // Custom query to find posts by a specific user (for "My Blog" page)
    List<Post> findByAuthorId(String userId);
    
    // Helper to sort by newest first
    List<Post> findAllByOrderByDateDesc();
}