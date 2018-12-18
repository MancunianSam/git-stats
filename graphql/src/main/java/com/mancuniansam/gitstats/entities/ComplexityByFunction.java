package com.mancuniansam.gitstats.entities;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="complexity_by_function")
@SuppressWarnings("unused")
public class ComplexityByFunction {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@Column(name = "repository_id")
	private Integer repositoryId;

	private String name;

	private Integer nloc;

	private Integer complexity;

}
