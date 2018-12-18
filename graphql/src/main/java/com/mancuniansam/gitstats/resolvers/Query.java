package com.mancuniansam.gitstats.resolvers;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.mancuniansam.gitstats.entities.ComplexityByFunction;
import com.mancuniansam.gitstats.repositories.ComplexityByFunctionRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class Query implements GraphQLQueryResolver {

	private ComplexityByFunctionRepository complexityByFunctionRepository;

	public Query(ComplexityByFunctionRepository complexityByFunctionRepository) {
		this.complexityByFunctionRepository = complexityByFunctionRepository;
	}

	@SuppressWarnings("unused")
	public List<ComplexityByFunction> complexityBarChart(Integer repositoryId) {
		return complexityByFunctionRepository.findTop10ByRepositoryIdOrderByComplexityDesc(repositoryId);
	}
}
