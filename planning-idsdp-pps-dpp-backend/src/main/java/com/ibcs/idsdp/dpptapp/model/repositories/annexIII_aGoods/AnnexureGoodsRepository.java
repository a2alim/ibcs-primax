package com.ibcs.idsdp.dpptapp.model.repositories.annexIII_aGoods;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods.AnnexureGoods;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AnnexureGoodsRepository extends ServiceRepository<AnnexureGoods> {

    Page<AnnexureGoods> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    AnnexureGoods findByIdAndStatusAndIsDeleted(Long id, Boolean status, Boolean isDelete);
    AnnexureGoods findByFormTypeAndProjectConceptUuidAndIsDeleted(String formType, String projectConceptUuid, Boolean isDeleted);
}
