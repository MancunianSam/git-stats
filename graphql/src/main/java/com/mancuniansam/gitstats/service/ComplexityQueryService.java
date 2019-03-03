package com.mancuniansam.gitstats.service;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.mancuniansam.gitstats.entities.ComplexityByFile;
import com.mancuniansam.gitstats.entities.ComplexityByFunction;
import com.mancuniansam.gitstats.entities.ComplexityByRepository;
import com.mancuniansam.gitstats.repositories.ComplexityByFileRepository;
import com.mancuniansam.gitstats.repositories.ComplexityByFunctionRepository;
import com.mancuniansam.gitstats.repositories.ComplexityByRepositoryRepository;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

@Component
public class ComplexityQueryService implements GraphQLQueryResolver {

	private ComplexityByFunctionRepository complexityByFunctionRepository;
	private ComplexityByFileRepository complexityByFileRepository;
	private ComplexityByRepositoryRepository complexityByRepositoryRepository;

	public ComplexityQueryService(ComplexityByFunctionRepository complexityByFunctionRepository,
								  ComplexityByFileRepository complexityByFileRepository,
								  ComplexityByRepositoryRepository complexityByRepositoryRepository) {
		this.complexityByFunctionRepository = complexityByFunctionRepository;
		this.complexityByFileRepository = complexityByFileRepository;
		this.complexityByRepositoryRepository = complexityByRepositoryRepository;
	}

	List<ComplexityByFunction> complexityByFunction(Long repositoryId) {
		return complexityByFunction(repositoryId, null);
	}

	public List<ComplexityByFunction> complexityByFunction(Long repositoryId, String filePath) {
		if(isNull(filePath)) {
			return complexityByFunctionRepository
					.findTop10ByComplexityRepository_IdOrderByComplexityDesc(repositoryId);
		}
		return complexityByFunctionRepository
				.findTop10ByComplexityRepository_IdAndFunction_File_FilePathOrderByComplexityDesc(repositoryId, filePath);
	}

	List<ComplexityByFile> complexityByFile(Long repositoryId) {
		return complexityByFile(repositoryId, null);
	}

	public List<ComplexityByFile> complexityByFile(Long repositoryId, String filePath) {
		if(isNull(filePath)) {
			return this.complexityByFileRepository
					.findTop10ByComplexityRepository_IdOrderByComplexityDesc(repositoryId);
		}
		return this.complexityByFileRepository
				.findTop10ByComplexityRepository_IdAndFile_filePathOrderByComplexityDesc(repositoryId, filePath);
	}

	public List<ComplexityByRepository> complexityByRepository(Long repositoryId) {
		return complexityByRepositoryRepository.findTop10ByComplexityRepository_IdOrderByComplexityDesc(repositoryId);
	}

	public Set<String> searchFileName(Long repositoryId, String name) {
		if (isNull(name) || name.isEmpty()) {
			return Collections.emptySet();
		}
		List<ComplexityByFile> files = complexityByFileRepository
				.findTop10ByComplexityRepository_IdAndFile_FilePathLike(repositoryId, "%" + name + "%");

		return files.stream()
				.map(ComplexityByFile::getFilePath)
				.collect(Collectors.toSet());
	}
}
