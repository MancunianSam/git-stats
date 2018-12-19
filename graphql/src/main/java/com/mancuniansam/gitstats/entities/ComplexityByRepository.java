package com.mancuniansam.gitstats.entities;


import javax.persistence.*;

@Entity
@Table(name="complexity_by_repository")
@SuppressWarnings("unused")
public class ComplexityByRepository {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@Column(name = "repository_id")
	private Integer repositoryId;

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
