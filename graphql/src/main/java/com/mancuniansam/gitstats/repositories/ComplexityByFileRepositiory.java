package com.mancuniansam.gitstats.repositories;

import com.mancuniansam.gitstats.entities.ComplexityByFile;
import org.springframework.data.repository.CrudRepository;

public interface ComplexityByFileRepositiory extends CrudRepository<ComplexityByFile, Long> {
}
