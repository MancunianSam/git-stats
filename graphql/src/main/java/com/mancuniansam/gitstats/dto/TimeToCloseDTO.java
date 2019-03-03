package com.mancuniansam.gitstats.dto;

public class TimeToCloseDTO extends PullRequestDTO {

	private Number daysToClose;

	public TimeToCloseDTO(Number daysToClose, Number numberOfPullRequests) {
		this.daysToClose = daysToClose;
		this.numberOfPullRequests = numberOfPullRequests;
	}

	public Number getDaysToClose() {
		return daysToClose;
	}



}
