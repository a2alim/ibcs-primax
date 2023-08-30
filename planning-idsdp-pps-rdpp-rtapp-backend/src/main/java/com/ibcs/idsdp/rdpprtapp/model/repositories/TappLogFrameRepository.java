package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappLogFrame;

import java.util.Optional;

public interface TappLogFrameRepository extends ServiceRepository<TappLogFrame> {
    Optional<TappLogFrame> findByPcUuid(String pcUuid);
}
