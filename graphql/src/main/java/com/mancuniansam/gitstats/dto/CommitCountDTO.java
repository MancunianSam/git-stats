package com.mancuniansam.gitstats.dto;

public class CommitCountDTO extends PullRequestDTO {

	private Number commitCount;

	public CommitCountDTO(Number commitCount, Number numberOfPullRequests) {
		this.commitCount = commitCount;
		this.numberOfPullRequests = numberOfPullRequests;
	}

	public Number getCommitCount() {
		return commitCount;
	}
}
