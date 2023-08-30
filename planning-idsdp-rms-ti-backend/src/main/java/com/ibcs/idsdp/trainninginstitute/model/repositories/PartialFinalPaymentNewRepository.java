package com.ibcs.idsdp.trainninginstitute.model.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentNewModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;

@Repository
public interface PartialFinalPaymentNewRepository  extends ServiceRepository<PartialFinalPaymentNewModel> {
	
	List<PartialFinalPaymentNewModel> findAllByIsDeletedAndProposalModel_Id(boolean isDeleted, Long proposalId);
	Page<PartialFinalPaymentNewModel> findAllByIsDeletedAndTrainingInstituteProfileId(boolean isDeleted,TrainingInstituteProfileModel trainingInstituteProfileId,  Pageable pageable);

   
}
