package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.DetailsCofog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DetailsCofogRepository extends ServiceRepository<DetailsCofog> {

    Page<DetailsCofog> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    List<DetailsCofog> findAllByOptionalCofogIdAndStatusAndIsDeleted(Long optionalCofogId, Boolean status, Boolean isDelete);

}
