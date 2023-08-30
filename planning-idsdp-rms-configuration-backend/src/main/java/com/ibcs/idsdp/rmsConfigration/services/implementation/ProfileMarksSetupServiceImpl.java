package com.ibcs.idsdp.rmsConfigration.services.implementation;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.ProfileMarksSetup;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ProfileMarksSetupRepository;
import com.ibcs.idsdp.rmsConfigration.services.ProfileMarksSetupService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ProfileMarksSetupRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ProfileMarksSetupResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
@Transactional

public class ProfileMarksSetupServiceImpl
		extends BaseService<ProfileMarksSetup, ProfileMarksSetupRequestDto, ProfileMarksSetupResponseDto>
		implements ProfileMarksSetupService {

	private final ProfileMarksSetupRepository profileMarksSetupRepository;

	protected ProfileMarksSetupServiceImpl(ServiceRepository<ProfileMarksSetup> repository,
			ProfileMarksSetupRepository profileMarksSetupRepository) {
		super(repository);
		this.profileMarksSetupRepository = profileMarksSetupRepository;
	}

	@Override
	public Response<ProfileMarksSetupResponseDto> findByStResearchCatTypeId(Long stResearchCatTypeId) {

		Optional<ProfileMarksSetup> optional = profileMarksSetupRepository.findByStResearchCatTypeIdAndIsDeleted(stResearchCatTypeId, false);

		if (optional.isPresent()) {
			return new Response<ProfileMarksSetupResponseDto>() {
				{
					setObj(convertForRead(optional.get()));
					setMessage("Data Found!.");
					setSuccess(true);
				}
			};
		}

		return getErrorResponse("Data Not Found!.");
	}

	@Override
	public Response<ProfileMarksSetupResponseDto> findByResearchCategory(String stResearchCatTypeId) {

		Optional<ProfileMarksSetup> optional = profileMarksSetupRepository.findByResearchCategoryAndIsDeleted(stResearchCatTypeId, false);

		if (optional.isPresent()) {
			return new Response<ProfileMarksSetupResponseDto>() {
				{
					setObj(convertForRead(optional.get()));
					setMessage("Data Found!.");
					setSuccess(true);
				}
			};
		}

		return getErrorResponse("Data Not Found!.");
	}
}
