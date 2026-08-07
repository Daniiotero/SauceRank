package com.saucerank.dto;

import java.util.List;

public class UserAlbumResponse {
    private Long albumId;
    private String albumName;
    private Integer albumYear;
    private String coverUrl;
    private List<VoteDetailResponse> songs;

    public Long getAlbumId() { return albumId; }
    public void setAlbumId(Long albumId) { this.albumId = albumId; }
    public String getAlbumName() { return albumName; }
    public void setAlbumName(String albumName) { this.albumName = albumName; }
    public Integer getAlbumYear() { return albumYear; }
    public void setAlbumYear(Integer albumYear) { this.albumYear = albumYear; }
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public List<VoteDetailResponse> getSongs() { return songs; }
    public void setSongs(List<VoteDetailResponse> songs) { this.songs = songs; }
}
