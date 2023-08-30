package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.ParticipantModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<ParticipantModel, Long> {

    Page<ParticipantModel> findByIsDeleted(Boolean isDeleted, Pageable pageable);

    Page<ParticipantModel> findByIsDeletedAndNameContainingIgnoreCase(Boolean isDeleted, String name, Pageable pageable);

    Optional<ParticipantModel> findByIsDeletedAndId(Boolean isDeleted, Long id);

    Optional<ParticipantModel> findAllByPhoneNoAndFiscalYearId(String phoneNo,long fiscalYearId);

    Optional<ParticipantModel> findAllByOtpCode(Integer otp);

    Optional<ParticipantModel> findAllByEmailAndFiscalYearId(String email,long fiscalYearId);

    Optional<ParticipantModel> findAllByIdAndIsDeleted(Long uuid,boolean isDeleted);

    Optional<ParticipantModel> findAllById(Long Id);

    Optional<ParticipantModel> findByIdAndIsDeleted(Long Id, boolean b);

    Optional<List<ParticipantModel>> findAllByProposalModel(ProposalModel proposalId);

   List<ParticipantModel> findAllByCreatedByAndIsDeleted(String tiId, boolean isDeleted);

    List<ParticipantModel> findAllByIsDeletedAndProposalModel_Id(boolean b, Long proposalId);

    List<ParticipantModel> findByIsDeletedAndProposalModel_Id(boolean b, Long id);

    Integer countByProposalModel_Id(Long id);
}
