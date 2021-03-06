package com.mancuniansam.gitstats.repositories;

import com.mancuniansam.gitstats.entities.ComplexityByRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ComplexityByRepositoryRepository extends CrudRepository<ComplexityByRepository, Long> {

	List<ComplexityByRepository> findTop10ByComplexityRepository_IdOrderByComplexityDesc(Long repositoryId);
}
