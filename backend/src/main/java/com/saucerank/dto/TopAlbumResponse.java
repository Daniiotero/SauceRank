package com.saucerank.dto;

public class TopAlbumResponse {
    private Long albumId;
    private String albumName;
    private Integer albumYear;
    private String coverUrl;
    private long voteCount;
    private double averageScore;
    private int rank;

    public TopAlbumResponse() {}

    public TopAlbumResponse(Long albumId, String albumName, Integer albumYear, String coverUrl,
                            long voteCount, double averageScore, int rank) {
        this.albumId = albumId;
        this.albumName = albumName;
        this.albumYear = albumYear;
        this.coverUrl = coverUrl;
        this.voteCount = voteCount;
        this.averageScore = averageScore;
        this.rank = rank;
    }

    public Long getAlbumId() { return albumId; }
    public void setAlbumId(Long albumId) { this.albumId = albumId; }
    public String getAlbumName() { return albumName; }
    public void setAlbumName(String albumName) { this.albumName = albumName; }
    public Integer getAlbumYear() { return albumYear; }
    public void setAlbumYear(Integer albumYear) { this.albumYear = albumYear; }
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public long getVoteCount() { return voteCount; }
    public void setVoteCount(long voteCount) { this.voteCount = voteCount; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
}
