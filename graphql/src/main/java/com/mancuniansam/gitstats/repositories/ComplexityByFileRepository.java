package com.mancuniansam.gitstats.repositories;

import com.mancuniansam.gitstats.entities.ComplexityByFile;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ComplexityByFileRepository extends CrudRepository<ComplexityByFile, Long> {

	List<ComplexityByFile> findTop10ByRepositoryIdOrderByComplexityDesc(Integer repositoryId);
}
