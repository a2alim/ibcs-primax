package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappFinancingAndExpectation;

import java.util.Optional;

public interface TappFinancingAndExpectationRepository extends ServiceRepository<TappFinancingAndExpectation> {
  Optional<TappFinancingAndExpectation> findByPcUuid(String pcUuid);
}
