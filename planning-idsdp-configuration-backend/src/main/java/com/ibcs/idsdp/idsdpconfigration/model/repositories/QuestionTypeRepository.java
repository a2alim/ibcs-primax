package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.QuestionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface QuestionTypeRepository extends ServiceRepository<QuestionType> {
    Page<QuestionType> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    List<QuestionType> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    QuestionType findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);
}
