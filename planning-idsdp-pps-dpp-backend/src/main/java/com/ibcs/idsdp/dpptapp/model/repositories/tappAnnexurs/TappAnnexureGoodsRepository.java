package com.ibcs.idsdp.dpptapp.model.repositories.tappAnnexurs;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureGoods;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TappAnnexureGoodsRepository extends ServiceRepository<TappAnnexureGoods> {
    Page<TappAnnexureGoods> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    TappAnnexureGoods findByIdAndStatusAndIsDeleted(Long id, Boolean status, Boolean isDelete);

    List<TappAnnexureGoods> findAllByFormTypeAndIsDeleted(String forType, Boolean isDelete);

    TappAnnexureGoods findTopByFormTypeAndProjectConceptUuidAndIsDeleted(String formType, String projectUuid, Boolean isDelete);
}
