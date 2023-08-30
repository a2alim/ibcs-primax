package com.ibcs.idsdp.rmsConfigration.services.implementation;

import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeSetup;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.model.repositories.CommitteeSetupRepository;
import com.ibcs.idsdp.rmsConfigration.services.CommitteeSetupService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CommitteeSetupRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommitteeSetupResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommitteeTypeResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

import javax.transaction.Transactional;

@Service
@Transactional

public class CommitteeSetupServiceImpl
		extends BaseService<CommitteeSetup, CommitteeSetupRequestDto, CommitteeSetupResponseDto>
		implements CommitteeSetupService {

	private final CommitteeSetupRepository committeeSetupRepository;

	protected CommitteeSetupServiceImpl(ServiceRepository<CommitteeSetup> repository,
			CommitteeSetupRepository committeeSetupRepository) {
		super(repository);
		this.committeeSetupRepository = committeeSetupRepository;
	}

	@Override
	public Response<CommitteeTypeResponseDto> createCommitteeSetup(CommitteeSetupRequestDto committeeSetupRequestDto) {

		return null;
	}

	@Override
	public Response<CommitteeTypeResponseDto> updateCommitteeType(CommitteeSetupRequestDto committeeSetupRequestDto) {

		return null;
	}

	@Override
	public Response<CommitteeSetup> findAllByActive(boolean isDeleted, boolean isActive) {
		Response<CommitteeSetup> response = new Response();
		List<CommitteeSetup> list = committeeSetupRepository.findAllByIsDeletedAndActive(isDeleted, isActive);
		if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
			response.setItems(list);
			return getSuccessResponse("Data Found!", response);
		}
		return getErrorResponse("Data Not Found!");
	}

}
