package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.List;
import java.util.Set;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.Zilla;

public interface ZillaRepository extends ServiceRepository<Zilla> {

    List<Zilla> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    List<Zilla> findAllByDivisionIdAndStatusAndIsDeleted(Long divisionId, Boolean status, Boolean isDelete);

    List<Zilla> findAllByDivisionIdInAndStatusAndIsDeleted(Set<Long> divisionIds, Boolean status, Boolean isDelete);

    List<Zilla> findAllByDivisionIdAndStatusAndIsDeletedOrderByNameEnAsc(Long divisionId, boolean b, boolean b1);
}
