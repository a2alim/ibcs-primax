package com.ibcs.idsdp.rmsConfigration.services.implementation;

import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeSetup;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;
import com.ibcs.idsdp.rmsConfigration.model.repositories.CommitteeTypeRepository;
import com.ibcs.idsdp.rmsConfigration.services.CommitteeTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CommitteeTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommitteeTypeResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

import javax.transaction.Transactional;

@Service
@Transactional
public class CommitteeTypeServiceImpl extends
		BaseService<CommitteeType, CommitteeTypeRequestDto, CommitteeTypeResponseDto> implements CommitteeTypeService {

	private final CommitteeTypeRepository committeeTypeRepository;

	protected CommitteeTypeServiceImpl(ServiceRepository<CommitteeType> repository,
			CommitteeTypeRepository committeeTypeRepository) {
		super(repository);
		this.committeeTypeRepository = committeeTypeRepository;
	}

	@Override
	public Response<CommitteeTypeResponseDto> createCommitteeType(CommitteeTypeRequestDto committeeTypeRequestDto) {

		Boolean isExists = isExistsBeforeSave("st_committee_type", "committee_name",
				committeeTypeRequestDto.getCommitteeName());

		if (!isExists) {
			return create(committeeTypeRequestDto);
		}

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<CommitteeTypeResponseDto> updateCommitteeType(CommitteeTypeRequestDto committeeTypeRequestDto) {

		Boolean isExists = isExistsBeforeUpdate("st_committee_type", "committee_name", committeeTypeRequestDto.getId(),
				committeeTypeRequestDto.getCommitteeName());

		if (!isExists) {
			return update(committeeTypeRequestDto);
		}

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<CommitteeType> findAllByActive(boolean isDeleted, boolean isActive) {
		Response<CommitteeType> response = new Response();
		List<CommitteeType> list = committeeTypeRepository.findAllByIsDeletedAndActive(isDeleted, isActive);
		if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
			response.setItems(list);
			return getSuccessResponse("Data Found!", response);
		}
		return getErrorResponse("Data Not Found!");
	}

}
