package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.ChequeCollectionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChequeCollectionRepository extends JpaRepository<ChequeCollectionModel,Long> {
    Page<ChequeCollectionModel> findByIsDeletedAndTrainingInstituteProfileModel_TrainingInstituteNameContainsIgnoreCase(Boolean isDeleted, String trainingInstituteName, Pageable pageable);

    Page<ChequeCollectionModel> findByIsDeleted(Boolean isDeleted, Pageable pageable);

    Optional<ChequeCollectionModel> findByIsDeletedAndId(Boolean isDeleted, Long id);


}
