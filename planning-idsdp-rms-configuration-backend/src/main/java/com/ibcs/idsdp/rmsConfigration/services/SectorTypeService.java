package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.SectorType;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.SectorTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.util.Response;

public interface SectorTypeService {
	
	Response<SectorTypeResponseDto>  createSectorType(SectorTypeRequestDto sectorTypeRequestDto);	
	Response<SectorTypeResponseDto>  updateSectorType(SectorTypeRequestDto sectorTypeRequestDto);
	Response<SectorType> findAllByActive(boolean isDeleted, boolean isActive);

}
