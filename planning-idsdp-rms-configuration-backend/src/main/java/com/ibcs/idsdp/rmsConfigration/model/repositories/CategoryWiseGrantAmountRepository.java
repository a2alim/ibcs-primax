package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryWiseGrantAmountRepository extends ServiceRepository<CategoryWiseGrantAmount> {
    Page<CategoryWiseGrantAmount>findAllByIsDeleted(Boolean isDeleted, Pageable pageable);

    // Page<CategoryWiseGrantAmount> findAllByIsDeleted(boolean isDeleted, PageRequest of);
}
