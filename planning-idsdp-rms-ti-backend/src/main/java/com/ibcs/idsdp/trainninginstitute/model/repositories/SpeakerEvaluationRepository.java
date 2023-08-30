package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.SpeakerEvaluationModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpeakerEvaluationRepository extends JpaRepository<SpeakerEvaluationModel
        ,Long> {


    @Override
    Optional<SpeakerEvaluationModel> findById(Long aLong);

    Page<SpeakerEvaluationModel> findByIsDeleted(Boolean isDeleted, Pageable pageable);

    Page<SpeakerEvaluationModel> findByIdAndIsDeleted(Long id, Boolean isDeleted, Pageable pageable);

    Optional<SpeakerEvaluationModel> findByIsDeletedAndId(Boolean isDeleted, Long id);

    boolean existsByIsDeletedAndProposalModel_IdAndCourseScheduleModel_IdAndTrainer_IdAndParticipantModel_Id(
            Boolean isDeleted, Long id, Long id1, Long id2, Long id3);


}
