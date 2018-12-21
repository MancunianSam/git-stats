package com.mancuniansam.gitstats.entities;


import javax.persistence.*;

@Entity
@Table(name="complexity_by_file")
@SuppressWarnings("unused")
public class ComplexityByFile extends ComplexityAggregates {

	@ManyToOne
	@JoinColumn(name = "file_id")
	private Files file;

	public Files getFile() {
		return file;
	}

	public void setFile(Files file) {
		this.file = file;
	}

	public String getFilePath() {
		return this.file.getFilePath();
	}

	public String getName() {
		return this.file.getFileName();
	}



}
