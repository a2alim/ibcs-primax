package com.ibcs.idsdp.rmsConfigration.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.ProfileMarksSetupConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.ProfileMarksSetup;
import com.ibcs.idsdp.rmsConfigration.services.ProfileMarksSetupService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ProfileMarksSetupRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ProfileMarksSetupResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ProfileMarksSetupConstant.PROFILE_MARKS_SETUP)
public class ProfileMarksSetupController
		extends BaseController<ProfileMarksSetup, ProfileMarksSetupRequestDto, ProfileMarksSetupResponseDto> {

	final private ProfileMarksSetupService profileMarksSetupService;

	public ProfileMarksSetupController(
			BaseService<ProfileMarksSetup, ProfileMarksSetupRequestDto, ProfileMarksSetupResponseDto> service,
			ProfileMarksSetupService profileMarksSetupService) {
		super(service);
		this.profileMarksSetupService = profileMarksSetupService;
	}

	@GetMapping(path = "/find-by-St-research-cat-type-id/{stResearchCatTypeId}", produces = "application/json")
	Response<ProfileMarksSetupResponseDto> findByStResearchCatTypeId(@PathVariable("stResearchCatTypeId") Long stResearchCatTypeId) {
		return profileMarksSetupService.findByStResearchCatTypeId(stResearchCatTypeId);
	}

	//	get for profile markset up number
	@GetMapping(path = "/get-marks-setup-by-rCat-id/{stResearchCatTypeId}", produces = "application/json")
	Response<ProfileMarksSetupResponseDto> findByResearchCategory(@PathVariable("stResearchCatTypeId") String stResearchCatTypeId) {
		return profileMarksSetupService.findByResearchCategory(stResearchCatTypeId);
	}
}
