package com.ibcs.idsdp.idsdpconfigration.model.repositories.annexIII_aGoods;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface AnnexureGoodsDetailsRepository extends ServiceRepository<AnnexureGoodsDetails> {

//    AnnexureGoodsDetails findByIdAndStatusAndIsDeleted(Long id, Boolean status, Boolean isDelete);
}
