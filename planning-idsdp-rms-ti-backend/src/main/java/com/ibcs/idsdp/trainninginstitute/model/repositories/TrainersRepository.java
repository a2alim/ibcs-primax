package com.ibcs.idsdp.trainninginstitute.model.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;


@Repository
public interface TrainersRepository extends ServiceRepository<Trainer> {

    Page<Trainer> findAllByIsDeletedOrderByIdDesc(Boolean isDeleted, Pageable pageable);
    Page<Trainer> findAllByIsDeletedAndProposalModel(Boolean isDeleted, Pageable pageable, ProposalModel proposalModel);
    Optional<Trainer> findAllByIdAndIsDeleted(Long id,Boolean isDeleted);
    Optional<List<Trainer>> findAllByFiscalYearId(Long id);
    Optional<List<Trainer>> findAllByFiscalYearIdAndIsDeleted(Long id,Boolean isDeleted);
    List<Trainer> findAllByIsDeletedAndIdIn(Boolean isDeleted, List<Long> ids);
    Optional<Trainer> findByIdAndIsDeleted(Long id, Boolean isDeleted);
    List<Trainer>findAllByIsDeletedAndProposalModel(Boolean isDeleted, ProposalModel proposalModel);
}
