package com.ibcs.idsdp.rpm.services;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;

import com.ibcs.idsdp.rpm.web.dto.request.MemberInSeminarRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.MemberInSeminarResponseDto;
import com.ibcs.idsdp.util.Response;

public interface MemberInSeminarService {	
	
	public Response<MemberInSeminarResponseDto>findByCreateSeminarId(Long createSeminarId);
	public Response<MemberInSeminarResponseDto> createList(List<MemberInSeminarRequestDto> memberInSeminarRequestDtoList);

}
