package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppTappGo;

public interface DppTappGoRepository extends ServiceRepository<DppTappGo> {

    DppTappGo findByPcUuidAndOrderTypeAndIsDeleted(String pcUuid, String orderType, boolean isDeleted);

}
