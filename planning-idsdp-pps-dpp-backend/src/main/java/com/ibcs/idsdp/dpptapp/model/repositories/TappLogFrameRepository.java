package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TappLogFrame;

import java.util.List;
import java.util.Optional;

public interface TappLogFrameRepository extends ServiceRepository<TappLogFrame> {
    Optional<TappLogFrame> findByPcUuid(String pcUuid);
}
