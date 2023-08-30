package com.ibcs.idsdp.rdpprtapp.model.repositories.annexIII_aGoods;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;

import java.util.List;
import java.util.Optional;


public interface AnnexureGoodsDetailsRepository extends ServiceRepository<AnnexureGoodsDetails> {

    List<AnnexureGoodsDetails> findAllByAnnexureGoodsIdAndIsDeleted(Long id, Boolean isDeleted);

    Optional<AnnexureGoodsDetails> findById(Long id);

}
