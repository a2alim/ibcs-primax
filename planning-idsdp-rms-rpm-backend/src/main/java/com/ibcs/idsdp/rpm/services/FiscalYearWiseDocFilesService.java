package com.ibcs.idsdp.rpm.services;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.rpm.web.dto.request.FiscalYearWiseDocFilesRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FiscalYearWiseDocFilesResponseDto;
import com.ibcs.idsdp.util.Response;


public interface FiscalYearWiseDocFilesService {

	Response<FiscalYearWiseDocFilesResponseDto> uploadProposalDoc(FiscalYearWiseDocFilesRequestDto fiscalYearWiseDocFilesRequestDto, Optional<MultipartFile> file);
	Response<FiscalYearWiseDocFilesResponseDto> findAllByStFiscalYearId(Long stFiscalYearId);
	Response<FiscalYearWiseDocFilesResponseDto> deleteDoc(Long id);

}
