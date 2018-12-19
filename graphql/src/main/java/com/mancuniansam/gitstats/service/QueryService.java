package com.mancuniansam.gitstats.service;

import com.mancuniansam.gitstats.entities.ComplexityByFile;
import com.mancuniansam.gitstats.entities.ComplexityByFunction;
import com.mancuniansam.gitstats.entities.ComplexityByRepository;
import com.mancuniansam.gitstats.repositories.ComplexityByFileRepository;
import com.mancuniansam.gitstats.repositories.ComplexityByFunctionRepository;
import com.mancuniansam.gitstats.repositories.ComplexityByRepositoryRepository;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class QueryService {

	private ComplexityByFunctionRepository complexityByFunctionRepository;
	private ComplexityByFileRepository complexityByFileRepository;
	private ComplexityByRepositoryRepository complexityByRepositoryRepository;

	public QueryService(ComplexityByFunctionRepository complexityByFunctionRepository,
						ComplexityByFileRepository complexityByFileRepository,
						ComplexityByRepositoryRepository complexityByRepositoryRepository) {
		this.complexityByFunctionRepository = complexityByFunctionRepository;
		this.complexityByFileRepository = complexityByFileRepository;
		this.complexityByRepositoryRepository = complexityByRepositoryRepository;
	}

	public List<ComplexityByFunction> complexityByFunction(Integer repositoryId) {
		return complexityByFunctionRepository.findTop10ByRepositoryIdOrderByComplexityDesc(repositoryId);
	}

	public List<ComplexityByFile> complexityByFile(Integer repositoryId) {
		return this.complexityByFileRepository.findTop10ByRepositoryIdOrderByComplexityDesc(repositoryId);
	}

	public List<ComplexityByRepository> complexityByRepository(Integer repositoryId) {
		return complexityByRepositoryRepository.findTop10ByRepositoryIdOrderByComplexityDesc(repositoryId);
	}

	public void doSomething() {
		Collections.singletonList("".substring("".lastIndexOf("/")));
	}

}
