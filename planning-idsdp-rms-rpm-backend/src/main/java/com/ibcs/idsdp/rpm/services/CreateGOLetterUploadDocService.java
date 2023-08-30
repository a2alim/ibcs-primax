package com.ibcs.idsdp.rpm.services;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.rpm.web.dto.response.CreateGOLetterUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

public interface CreateGOLetterUploadDocService {

	Response<CreateGOLetterUploadDocResponseDto> saveGoLetterFiles(String body, Optional<MultipartFile[]> files, String updatedFileList);

	Response<CreateGOLetterUploadDocResponseDto> findAllByGoLetterId(Long goLetterId);
}
