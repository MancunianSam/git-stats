package com.mancuniansam.gitstats.dto;

public class TopLineChangesDTO {

	private String title;

	private Integer lineChanges;

	public TopLineChangesDTO(String title, Integer lineChanges) {
		this.title = title;
		this.lineChanges = lineChanges;
	}

	public String getTitle() {
		return title;
	}

	public Integer getLineChanges() {
		return lineChanges;
	}
}
