package com._blog.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    
    @Column(length = 1000)
    private String excerpt;
    
    @Column(columnDefinition = "TEXT") // Allows long text for content
    private String content; // Stored as a joined string or JSON in DB
    
    private String category;
    private String image;
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    // List of User IDs who liked the post
    @ElementCollection
    private List<String> likes = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "post_id") // Creates a foreign key in comments table
    private List<Comment> comments = new ArrayList<>();

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    // Frontend sends array ["para1", "para2"], backend stores "para1\n\npara2"
    public List<String> getContentList() { 
        return content != null ? List.of(content.split("\n\n")) : new ArrayList<>(); 
    }
    public void setContentList(List<String> paragraphs) {
        this.content = String.join("\n\n", paragraphs);
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    
    public List<String> getLikes() { return likes; }
    public void setLikes(List<String> likes) { this.likes = likes; }
    
    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
}