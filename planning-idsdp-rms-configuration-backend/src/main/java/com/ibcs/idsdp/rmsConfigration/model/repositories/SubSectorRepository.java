package com.ibcs.idsdp.rmsConfigration.model.repositories;

/**
 * @author moniruzzaman.rony
 * @create 9/26/21
 * @github `https://github.com/moniruzzamanrony`
 */
import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;
import com.ibcs.idsdp.rmsConfigration.model.domain.SubSector;

import java.util.List;

@Repository
public interface SubSectorRepository extends ServiceRepository<SubSector>{

    List<SubSector> findBysectorTypeIdIdAndIsDeleted(Long id,boolean flag);
    List<SubSector> findAllByIsDeletedAndActive(boolean isDeleted, boolean isActive);
    SubSector findByIdAndIsDeleted(Long id, Boolean isDelete);
}
