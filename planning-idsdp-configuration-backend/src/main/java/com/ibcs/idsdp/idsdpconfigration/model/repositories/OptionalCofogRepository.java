package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.OptionalCofog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OptionalCofogRepository extends ServiceRepository<OptionalCofog> {

    Page<OptionalCofog> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    List<OptionalCofog> findByMainCofogIdAndStatusAndIsDeleted(long mainCofogId, Boolean status, Boolean isDelete);

    OptionalCofog findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);
}
