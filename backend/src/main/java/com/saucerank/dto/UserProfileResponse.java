package com.saucerank.dto;

import java.util.List;

public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private List<UserAlbumResponse> albums;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<UserAlbumResponse> getAlbums() { return albums; }
    public void setAlbums(List<UserAlbumResponse> albums) { this.albums = albums; }
}
