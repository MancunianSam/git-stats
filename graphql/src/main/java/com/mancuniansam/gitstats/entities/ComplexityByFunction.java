package com.mancuniansam.gitstats.entities;


import javax.persistence.*;

@Entity
@Table(name="complexity_by_function")
@SuppressWarnings("unused")
public class ComplexityByFunction extends ComplexityAggregates {

	@ManyToOne
	@JoinColumn(name = "function_id")
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
