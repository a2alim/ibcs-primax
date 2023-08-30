package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.SubSector;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.SubSectorRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.SubSectorResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.PathVariable;

public interface SubSectorService {	
	
	Response<SubSectorResponseDto> createSubSector(SubSectorRequestDto subSectorRequestDto1);
	Response<SubSectorResponseDto> updateSubSector(SubSectorRequestDto subSectorRequestDto1);
	Response<SubSector> findAllByActive(boolean isDeleted, boolean isActive);

    Response<SubSectorResponseDto> findBySectorId(Long sectorId);
	Response<SubSectorResponseDto> getSubSectorById(Long id);
}
