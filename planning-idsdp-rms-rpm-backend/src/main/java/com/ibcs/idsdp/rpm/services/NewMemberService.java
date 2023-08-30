package com.ibcs.idsdp.rpm.services;

import java.util.List;

import com.ibcs.idsdp.rpm.web.dto.request.NewMemberRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.NewMemberResponseDto;
import com.ibcs.idsdp.util.Response;

public interface NewMemberService {

	Response<NewMemberResponseDto> saveOrUpdateNewMemberList(List<NewMemberRequestDto> newMemberList);
	Response<NewMemberResponseDto> findAllByResearcherPresentationId(Long researcherPresentationId);

}
