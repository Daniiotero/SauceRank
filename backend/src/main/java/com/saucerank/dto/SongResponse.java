package com.saucerank.dto;

public class SongResponse {
    private Long id;
    private String title;
    private Integer trackNumber;
    private String featuredArtists;
    private String spotifyTrackId;
    private boolean votedByCurrentUser;
    private long voteCount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getTrackNumber() { return trackNumber; }
    public void setTrackNumber(Integer trackNumber) { this.trackNumber = trackNumber; }
    public String getFeaturedArtists() { return featuredArtists; }
    public void setFeaturedArtists(String featuredArtists) { this.featuredArtists = featuredArtists; }
    public String getSpotifyTrackId() { return spotifyTrackId; }
    public void setSpotifyTrackId(String spotifyTrackId) { this.spotifyTrackId = spotifyTrackId; }
    public boolean isVotedByCurrentUser() { return votedByCurrentUser; }
    public void setVotedByCurrentUser(boolean votedByCurrentUser) { this.votedByCurrentUser = votedByCurrentUser; }
    public long getVoteCount() { return voteCount; }
    public void setVoteCount(long voteCount) { this.voteCount = voteCount; }
}
