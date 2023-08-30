package com.ibcs.idsdp.trainninginstitute.model.repositories;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.trainninginstitute.model.domain.GoLetter;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentNewModel;

@Repository
public interface GoLetterRepository extends ServiceRepository<GoLetter>{
	
 Optional<GoLetter>	findByPartialFinalPaymentIdAndIsDeleted(PartialFinalPaymentNewModel partialFinalPaymentId , Boolean isDeleted);

}
