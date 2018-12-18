package com.mancuniansam.gitstats.entities;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="complexity_by_function")
@SuppressWarnings("unused")
public class ComplexityByRepository {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@Column(name = "repository_id")
	private Integer repositoryId;

	private Integer nloc;

	private Integer complexity;

}
