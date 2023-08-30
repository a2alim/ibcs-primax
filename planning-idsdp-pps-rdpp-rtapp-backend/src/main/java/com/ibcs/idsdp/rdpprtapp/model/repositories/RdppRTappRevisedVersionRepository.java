package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.RdppRtappRevisedVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RdppRTappRevisedVersionRepository extends JpaRepository<RdppRtappRevisedVersion, Long> {

    List<RdppRtappRevisedVersion> findAllByPcUuid(String pcUuid);

    Optional<RdppRtappRevisedVersion> findByRdppMasterId(Long id);

    Optional<RdppRtappRevisedVersion> findByRtppMasterId(Long id);
}
