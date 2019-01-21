package com.mancuniansam.gitstats.repositories;

import com.mancuniansam.gitstats.entities.ComplexityByFunction;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ComplexityByFunctionRepository extends CrudRepository<ComplexityByFunction, Long> {

	List<ComplexityByFunction> findTop10ByComplexityRepository_IdOrderByComplexityDesc(Long repositoryId);

	List<ComplexityByFunction> findTop10ByComplexityRepository_IdAndFunction_File_FilePathOrderByComplexityDesc(Long repositoryId, String filePath);
}
