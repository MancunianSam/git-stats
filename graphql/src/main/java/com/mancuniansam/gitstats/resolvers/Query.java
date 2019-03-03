//package com.mancuniansam.gitstats.resolvers;
//
//import com.coxautodev.graphql.tools.GraphQLQueryResolver;
//import com.mancuniansam.gitstats.entities.ComplexityByFile;
//import com.mancuniansam.gitstats.entities.ComplexityByFunction;
//import com.mancuniansam.gitstats.entities.ComplexityByRepository;
//import com.mancuniansam.gitstats.service.ComplexityQueryService;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//import java.util.Set;
//
//@SuppressWarnings("unused")
//@Component
//public class Query implements GraphQLQueryResolver {
//
//	private ComplexityQueryService service;
//
//	public Query(ComplexityQueryService service) {
//		this.service = service;
//	}
//
//	public List<ComplexityByFunction> complexityByFunction(Long repositoryId, String filePath) {
//		return service.complexityByFunction(repositoryId, filePath);
//	}
//
//	public List<ComplexityByFile> complexityByFile(Long repositoryId, String filePath) {
//		return service.complexityByFile(repositoryId, filePath);
//	}
//
//	public List<ComplexityByRepository> complexityByRepository(Long repositoryId) {
//		return service.complexityByRepository(repositoryId);
//	}
//
//	public Set<String> searchFileName(Long repositoryId, String name) {
//		return service.searchFileName(repositoryId, name);
//	}
//}
