package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Faq;
import com.ibcs.idsdp.model.domain.ImsModule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FaqRepository extends ServiceRepository<Faq> {
    List<Faq> findAllByQuestionContainingIgnoreCaseAndIsActiveAndIsDeletedOrderById(String question, Boolean isActive, Boolean isDeleted);
    List<Faq> findAllByQuestionContainingIgnoreCaseAndImsModuleIdAndIsActiveAndIsDeletedOrderById(String question, String imsModuleId, Boolean isActive, Boolean isDeleted);
    Page<Faq> findAllByIsActiveAndIsDeleted(Boolean isActive, Boolean isDeleted, Pageable pageable);

}
