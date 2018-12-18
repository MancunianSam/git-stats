package com.mancuniansam.gitstats.entities;


import lombok.Data;

import javax.persistence.*;

@Data
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

}
