package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Currency;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Division;

import java.util.List;

public interface CurrencyRepository extends ServiceRepository<Currency> {
    List<Currency> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);
}
