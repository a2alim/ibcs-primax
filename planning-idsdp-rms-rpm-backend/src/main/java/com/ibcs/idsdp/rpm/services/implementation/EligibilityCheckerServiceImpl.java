package com.ibcs.idsdp.rpm.services.implementation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.EligibilityChecker;
import com.ibcs.idsdp.rpm.model.repositories.EligibilityCheckerRepository;
import com.ibcs.idsdp.rpm.services.EligibilityCheckerService;
import com.ibcs.idsdp.rpm.web.dto.request.EligibilityCheckerRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.EligibilityCheckerResponseDto;
import com.ibcs.idsdp.util.CommonFunctions;
import com.ibcs.idsdp.util.Response;

@Service
public class EligibilityCheckerServiceImpl implements EligibilityCheckerService, CommonFunctions {

	Logger logger = LoggerFactory.getLogger(BaseService.class);

	private final EligibilityCheckerRepository eligibilityCheckerRepository;

	@Autowired
	private IdGeneratorComponent idGeneratorComponent;

	EligibilityCheckerServiceImpl(EligibilityCheckerRepository eligibilityCheckerRepository) {
		this.eligibilityCheckerRepository = eligibilityCheckerRepository;
	}

	@Override
	public Response<EligibilityCheckerResponseDto> createEligibilityChecker(EligibilityCheckerRequestDto eligibilityCheckerRequestDto) {

		Response<EligibilityCheckerResponseDto> response = new Response<EligibilityCheckerResponseDto>();

		EligibilityChecker eligibilityChecker = new EligibilityChecker();
		BeanUtils.copyProperties(eligibilityCheckerRequestDto, eligibilityChecker);
		eligibilityChecker.setUuid(idGeneratorComponent.generateUUID());
		eligibilityChecker.setIsDeleted(false);

		try {
			
			EligibilityChecker respone=  eligibilityCheckerRepository.save(eligibilityChecker);
			EligibilityCheckerResponseDto finalResponse = new EligibilityCheckerResponseDto();
			
			BeanUtils.copyProperties(respone, finalResponse);
			
			response.setObj(finalResponse);
			return getSuccessResponse("Created Successfully", response);
			
		} catch (Exception e) {
			logger.error(e.getMessage());
			return getErrorResponse("Save failed !!");
		}		
	}

}
