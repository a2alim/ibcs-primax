package com.ibcs.idsdp.rpm.services;

import org.springframework.data.domain.Page;

import com.ibcs.idsdp.rpm.web.dto.request.CreateGOLetterRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateGOLetterResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

public interface CreateGOLetterService {

	public Response<CreateGOLetterResponseDto> save(CreateGOLetterRequestDto createGOLetterRequestDto);

	public Response<CreateGOLetterResponseDto> findById(Long id);

	public Response<CreateGOLetterResponseDto> deleteById(Long id);

	Page<CreateGOLetterResponseDto> getAllGoLetter(CreateGOLetterRequestDto createGOLetterRequestDto);

	void update(String uid, CreateGOLetterRequestDto createGOLetterRequestDto);

	CreateGOLetterResponseDto getGoByUuid(String uuid);
}
