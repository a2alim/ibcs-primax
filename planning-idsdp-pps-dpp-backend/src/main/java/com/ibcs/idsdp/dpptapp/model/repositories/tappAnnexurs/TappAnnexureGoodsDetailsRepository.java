package com.ibcs.idsdp.dpptapp.model.repositories.tappAnnexurs;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureGoodsDetails;

import java.util.List;
import java.util.Optional;


public interface TappAnnexureGoodsDetailsRepository extends ServiceRepository<TappAnnexureGoodsDetails> {

//    TappAnnexureGoodsDetails findByIdAndStatusAndIsDeleted(Long id, Boolean status, Boolean isDelete);
    List<TappAnnexureGoodsDetails> findByTappAnnexureGoodsIdAndIsDeleted(Long id, Boolean isDelete);

    Optional<TappAnnexureGoodsDetails> findByUuid(String uuid);
}
