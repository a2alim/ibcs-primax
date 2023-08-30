package com.ibcs.idsdp.rpm.services;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.rpm.web.dto.response.GoLetterResponseDto;
import com.ibcs.idsdp.util.Response;

public interface GoLetterService {
	
	Response<GoLetterResponseDto> uploadDocument(String data, Optional<MultipartFile> file);
	Response<GoLetterResponseDto> findByUuid(String uuid);

}
