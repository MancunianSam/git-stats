package com.mancuniansam.gitstats.resolvers;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.mancuniansam.gitstats.entities.ComplexityByFile;
import com.mancuniansam.gitstats.entities.ComplexityByFunction;
import com.mancuniansam.gitstats.entities.ComplexityByRepository;
import com.mancuniansam.gitstats.service.QueryService;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@SuppressWarnings("unused")
@Component
public class Query implements GraphQLQueryResolver {

	private QueryService service;

	public Query(QueryService service) {
		this.service = service;
	}

	public List<ComplexityByFunction> complexityByFunction(Integer repositoryId, List<String> filters) {
		return service.complexityByFunction(repositoryId, filters);
	}

	public List<ComplexityByFile> complexityByFile(Integer repositoryId, List<String> filters) {
		return service.complexityByFile(repositoryId, filters);
	}

	public List<ComplexityByRepository> complexityByRepository(Integer repositoryId, List<String> filters) {
		return service.complexityByRepository(repositoryId, filters);
	}

	public Set<String> searchFileName(String name) {
		return service.filesByFileName(name);
	}
}
