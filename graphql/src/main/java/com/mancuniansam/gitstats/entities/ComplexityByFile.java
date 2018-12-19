package com.mancuniansam.gitstats.entities;


import javax.persistence.*;

@Entity
@Table(name="complexity_by_file")
@SuppressWarnings("unused")
public class ComplexityByFile {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@Column(name = "repository_id")
	private Integer repositoryId;

	private String name;

	private Integer nloc;

	private Integer complexity;


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getRepositoryId() {
		return repositoryId;
	}

	public void setRepositoryId(Integer repositoryId) {
		this.repositoryId = repositoryId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
}
