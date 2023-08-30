package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.List;
import java.util.Set;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.UpaZilla;

public interface UpaZillaRepository extends ServiceRepository<UpaZilla> {

    List<UpaZilla> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    List<UpaZilla> findAllByZillaIdAndStatusAndIsDeleted(Long zillaId, Boolean status, Boolean isDelete);

    List<UpaZilla> findAllByZillaIdInAndStatusAndIsDeleted(Set<Long> zillaIds, Boolean status, Boolean isDelete);

    List<UpaZilla> findAllByZillaIdAndStatusAndIsDeletedOrderByNameEnAsc(Long zillaId, boolean b, boolean b1);
}
