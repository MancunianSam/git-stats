package com.mancuniansam.gitstats.repositories;

import com.mancuniansam.gitstats.entities.ComplexityByFile;
import org.springframework.data.repository.CrudRepository;


import java.util.List;

public interface ComplexityByFileRepository extends CrudRepository<ComplexityByFile, Long> {

	List<ComplexityByFile> findTop10ByComplexityRepository_IdOrderByComplexityDesc(Long repositoryId);

	List<ComplexityByFile> findTop10ByComplexityRepository_IdAndFile_filePathOrderByComplexityDesc(Long repositoryId, String filePath);

	List<ComplexityByFile> findTop10ByComplexityRepository_IdAndFile_FilePathLike(Long repositoryId, String name);
}
