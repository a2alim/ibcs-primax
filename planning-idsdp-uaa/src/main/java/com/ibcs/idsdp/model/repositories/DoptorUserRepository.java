package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.DoptorUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoptorUserRepository extends JpaRepository<DoptorUser, Long> {
    Page<DoptorUser> findAllByIsActive(Boolean isActive, Pageable pageable);
}
