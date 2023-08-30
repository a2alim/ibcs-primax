package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.ChequeCollectionModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ENothiModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ENothiRepository extends JpaRepository<ENothiModel,Long> {
    Optional<ENothiModel> findByIsDeletedAndId(Boolean isDeleted, Long id);
    Page<ENothiModel> findByIsDeletedAndFiscalYearId(Boolean isDeleted, Long id, Pageable pageable);
    Page<ENothiModel> findByIsDeleted(Boolean isDeleted, Pageable pageable);
}
