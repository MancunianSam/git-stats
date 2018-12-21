package com.mancuniansam.gitstats.entities;


import javax.persistence.*;

@Entity
@Table(name="complexity_by_file")
@SuppressWarnings("unused")
public class ComplexityByFile {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "repository_id")
	private Repository repository;

	@ManyToOne
	@JoinColumn(name = "file_id")
	private Files file;

	private Integer nloc;

	private Integer complexity;


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Repository getRepository() {
		return repository;
	}

	public void setRepository(Repository repository) {
		this.repository = repository;
	}

	public Files getFile() {
		return file;
	}

	public void setFile(Files file) {
		this.file = file;
	}

	public Integer getNloc() {
		return nloc;
	}

	public void setNloc(Integer nloc) {
		this.nloc = nloc;
	}

	public Integer getComplexity() {
		return complexity;
	}

	public void setComplexity(Integer complexity) {
		this.complexity = complexity;
	}

	public String getFilePath() {
		return this.file.getFilePath();
	}

	public String getName() {
		return this.file.getFileName();
	}
}
