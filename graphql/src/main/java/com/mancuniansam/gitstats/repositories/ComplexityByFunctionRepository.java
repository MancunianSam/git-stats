package com.mancuniansam.gitstats.repositories;

import com.mancuniansam.gitstats.entities.ComplexityByFunction;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ComplexityByFunctionRepository extends CrudRepository<ComplexityByFunction, Long> {

	List<ComplexityByFunction> findTop10ByRepositoryIdOrderByComplexityDesc(Integer repositoryId);
}
