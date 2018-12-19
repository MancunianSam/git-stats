package com.mancuniansam.gitstats.resolvers;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.mancuniansam.gitstats.entities.ComplexityByFile;
import com.mancuniansam.gitstats.entities.ComplexityByFunction;
import com.mancuniansam.gitstats.entities.ComplexityByRepository;
import com.mancuniansam.gitstats.service.QueryService;
import org.springframework.stereotype.Component;

import java.util.List;

@SuppressWarnings("unused")
@Component
public class Query implements GraphQLQueryResolver {

	private QueryService service;

	public Query(QueryService service) {
		this.service = service;
	}

	public List<ComplexityByFunction> complexityByFunction(Integer repositoryId) {
		return service.complexityByFunction(repositoryId);
	}

	public List<ComplexityByFile> complexityByFile(Integer repositoryId) {
		return service.complexityByFile(repositoryId);
	}

	public List<ComplexityByRepository> complexityByRepository(Integer repositoryId) {
		return service.complexityByRepository(repositoryId);
	}
}
