package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MainCofog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MainCofogRepository extends ServiceRepository<MainCofog> {

    Page<MainCofog> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    MainCofog findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);
}
