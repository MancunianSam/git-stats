package com.mancuniansam.gitstats.entities;


import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;

@Entity
@Table(name="complexity_by_function")
@SuppressWarnings("unused")
public class ComplexityByFunction extends ComplexityAggregates {

	@OneToOne
	@JoinColumn(name = "function_id")
	@Fetch(FetchMode.JOIN)
	private FunctionDetails function;


	public FunctionDetails getFunction() {
		return function;
	}

	public void setFunction(FunctionDetails function) {
		this.function = function;
	}

	public String getName() {
		return this.function.getName();
	}
}
