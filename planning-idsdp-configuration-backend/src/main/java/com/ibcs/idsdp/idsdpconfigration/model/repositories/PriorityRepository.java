package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Priority;
import org.bouncycastle.asn1.dvcs.ServiceType;

import java.util.List;

public interface PriorityRepository extends ServiceRepository<Priority> {
    List<Priority> findAllByStatusAndIsDeleted(Boolean status, Boolean isDeleted);
}
