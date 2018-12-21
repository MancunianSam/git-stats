package com.mancuniansam.gitstats.entities;

import javax.persistence.*;

@MappedSuperclass
@SuppressWarnings("unused")
public class ComplexityAggregates {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "repository_id")
	private Repository repository;

	private Integer nloc;

	private Integer complexity;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Repository getRepository() {
		return repository;
	}

	public void setRepository(Repository repository) {
		this.repository = repository;
	}
}
