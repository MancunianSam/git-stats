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
	private ComplexityRepository complexityRepository;

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

	public ComplexityRepository getComplexityRepository() {
		return complexityRepository;
	}

	public void setComplexityRepository(ComplexityRepository complexityRepository) {
		this.complexityRepository = complexityRepository;
	}
}
