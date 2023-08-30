package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.NothiUsers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NothiUserRepository extends JpaRepository<NothiUsers, Long> {

    Page<NothiUsers> findAllByIsDeleteOrderByIdDesc(Boolean isDelete, Pageable pageable);

    Page<NothiUsers> findAllByIsActiveAndIsDeleteOrderByIdDesc(Boolean isActive, Boolean isDelete, Pageable pageable);

    NothiUsers findByNothiId(String nothiId);

    NothiUsers findByNothiIdAndIsDelete(String nothiId, Boolean isDelete);

    boolean existsByNothiIdAndIsDelete(String nothiId, Boolean isDeleted);

    boolean existsByEmailAndIsDelete(String email, Boolean isDeleted);
}
