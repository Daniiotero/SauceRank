package com.saucerank.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class VoteRequest {
    @NotNull
    private Long songId;

    @NotNull
    @Min(1)
    @Max(10)
    private Integer score;

    public Long getSongId() { return songId; }
    public void setSongId(Long songId) { this.songId = songId; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
}
