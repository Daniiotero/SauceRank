package com.saucerank.dto;

import jakarta.validation.constraints.NotNull;

public class VoteRequest {
    @NotNull
    private Long songId;

    public Long getSongId() { return songId; }
    public void setSongId(Long songId) { this.songId = songId; }
}
