package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.RtappAnnexureTwo;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappTermOfReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;


public interface RtappAnnexureTwoRepository extends ServiceRepository<RtappAnnexureTwo> {

    Page<RtappAnnexureTwo> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    RtappAnnexureTwo findByIdAndIsDeleted(Long id, Boolean isDelete);

    List<RtappAnnexureTwo> findAllByRtappMasterIdAndIsDeleted(Long rtappMasterId, Boolean isDeleted);

}
