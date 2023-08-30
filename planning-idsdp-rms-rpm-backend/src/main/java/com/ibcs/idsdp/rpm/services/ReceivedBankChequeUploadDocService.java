package com.ibcs.idsdp.rpm.services;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.rpm.web.dto.response.ReceivedBankChequeUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ReceivedBankChequeUploadDocService {

	Response<ReceivedBankChequeUploadDocResponseDto> saveReceivedBankCheqyeFiles(String body, Optional<MultipartFile[]> files, String updatedFileList);

	Response<ReceivedBankChequeUploadDocResponseDto> findAllByReceivedBankChequeId(Long id);
}
