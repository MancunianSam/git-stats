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
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

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

	public List<ComplexityByFunction> complexityByFunction(Integer repositoryId, List<String> filters) {
		return complexityByFunctionRepository.findTop10ByRepositoryIdOrderByComplexityDesc(repositoryId);
	}

	public List<ComplexityByFile> complexityByFile(Integer repositoryId, List<String> filters) {
		return this.complexityByFileRepository.findTop10ByRepositoryIdOrderByComplexityDesc(repositoryId);
	}

	public List<ComplexityByRepository> complexityByRepository(Integer repositoryId, List<String> filters) {
		return complexityByRepositoryRepository.findTop10ByRepositoryIdOrderByComplexityDesc(repositoryId);
	}

	public Set<String> filesByFileName(String name) {
		if (Objects.isNull(name) || name.isEmpty()) {
			return Collections.emptySet();
		}
		List<ComplexityByFile> files = complexityByFileRepository.findByNameLike("%" + name + "%");
		return files.stream()
				.map(file -> file.getName().substring(0, file.getName().lastIndexOf("/")))
				.collect(Collectors.toSet());
	}
}
