package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.idsdpconfigration.model.domain.DevelopmentPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DevelopmentPatnerRepository extends JpaRepository<DevelopmentPartner, String> {

    List<DevelopmentPartner> findAllByStatus(Boolean status);

    Optional<DevelopmentPartner> findAllByUuid(String Uuid);

    DevelopmentPartner findByIdAndIsDeleted(Long id, Boolean isDeleted);

}
