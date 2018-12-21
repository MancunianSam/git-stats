package com.mancuniansam.gitstats.repositories;

import com.mancuniansam.gitstats.entities.ComplexityByFile;
import org.springframework.data.repository.CrudRepository;


import java.util.List;

public interface ComplexityByFileRepository extends CrudRepository<ComplexityByFile, Long> {

	List<ComplexityByFile> findTop10ByRepository_IdOrderByComplexityDesc(Long repositoryId);

	List<ComplexityByFile> findTop10ByRepository_IdAndFile_filePathOrderByComplexityDesc(Long repositoryId, String filePath);

	List<ComplexityByFile> findByRepository_IdAndFile_FilePathLike(Long repositoryId, String name);
}
