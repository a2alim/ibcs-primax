package com.ibcs.idsdp.rmsConfigration.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.ResearchCategoryTypeConstant;
import com.ibcs.idsdp.rmsConfigration.constants.SectorTypeConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.model.domain.SectorType;
import com.ibcs.idsdp.rmsConfigration.services.SectorTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.SectorTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(SectorTypeConstant.SECTOR_TYPE)
public class SectorTypeController extends BaseController<SectorType, SectorTypeRequestDto, SectorTypeResponseDto> {

	public final SectorTypeService sectorTypeService;

	public SectorTypeController(BaseService<SectorType, SectorTypeRequestDto, SectorTypeResponseDto> service,
			SectorTypeService sectorTypeService) {
		super(service);
		this.sectorTypeService = sectorTypeService;
	}

	@PostMapping(path = SectorTypeConstant.CREATE_SECTOR_TYPE, produces = "application/json")
	public Response<SectorTypeResponseDto> createSectorType(@RequestBody SectorTypeRequestDto sectorTypeRequestDto) {

		return sectorTypeService.createSectorType(sectorTypeRequestDto);
	}

	@PutMapping(path = SectorTypeConstant.UPDATE_SECTOR_TYPE, produces = "application/json")
	public Response<SectorTypeResponseDto> updateSectorType(@RequestBody SectorTypeRequestDto sectorTypeRequestDto) {

		return sectorTypeService.updateSectorType(sectorTypeRequestDto);
	}
	
	@GetMapping(path = SectorTypeConstant.GET_ACTIVE_LIST, produces = "application/json")
	public Response<SectorType> findAllByActive() {
		return sectorTypeService.findAllByActive(false,true);
	}

}
