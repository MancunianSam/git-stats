package com.mancuniansam.gitstats.entities;

import javax.persistence.*;

@Entity
@Table(name="files")
@SuppressWarnings("unused")
public class Files {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@Column(name = "file_path")
	private String filePath;

	@Column(name = "file_name")
	private String fileName;

	private Integer nloc;

	@ManyToOne
	@JoinColumn(name = "repository_id")
	private ComplexityRepository complexityRepository;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public Integer getNloc() {
		return nloc;
	}

	public void setNloc(Integer nloc) {
		this.nloc = nloc;
	}

	public ComplexityRepository getComplexityRepository() {
		return complexityRepository;
	}

	public void setComplexityRepository(ComplexityRepository complexityRepository) {
		this.complexityRepository = complexityRepository;
	}
}
