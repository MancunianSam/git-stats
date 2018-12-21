package com.mancuniansam.gitstats.entities;

import javax.persistence.*;

@Entity
@Table(name="function_details")
@SuppressWarnings("unused")
public class FunctionDetails {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	private String name;

	private Integer nloc;

	@Column(name = "complexity")
	private Integer complexity;

	@ManyToOne
	@JoinColumn(name = "file_id")
	private Files file;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Files getFile() {
		return file;
	}

	public void setFile(Files file) {
		this.file = file;
	}
}
