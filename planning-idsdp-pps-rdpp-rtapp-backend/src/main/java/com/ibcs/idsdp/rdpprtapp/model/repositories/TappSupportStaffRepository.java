package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.TappSupportStuff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TappSupportStaffRepository extends JpaRepository<TappSupportStuff, Long> {
    Optional<TappSupportStuff> findByUuid(String uuid);
    List<TappSupportStuff> findAllByProjectConceptMasterId(Long id);
}
