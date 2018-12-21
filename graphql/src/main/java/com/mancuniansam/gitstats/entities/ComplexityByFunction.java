package com.mancuniansam.gitstats.entities;


import javax.persistence.*;

@Entity
@Table(name="complexity_by_function")
@SuppressWarnings("unused")
public class ComplexityByFunction {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "repository_id")
	private Repository repository;

	@ManyToOne
	@JoinColumn(name = "function_id")
	private FunctionDetails function;

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

	public Repository getRepository() {
		return repository;
	}

	public void setRepository(Repository repository) {
		this.repository = repository;
	}

	public FunctionDetails getFunction() {
		return function;
	}

	public void setFunction(FunctionDetails function) {
		this.function = function;
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

	public String getName() {
		return this.function.getName();
	}
}
