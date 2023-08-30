package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.SubSectorConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.SubSector;
import com.ibcs.idsdp.rmsConfigration.services.SubSectorService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.SubSectorRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.SubSectorResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(SubSectorConstant.SUB_SECTOR)
public class SubSectorController extends BaseController<SubSector, SubSectorRequestDto, SubSectorResponseDto> {

	private final SubSectorService subSectorService;

	public SubSectorController(BaseService<SubSector, SubSectorRequestDto, SubSectorResponseDto> service, SubSectorService subSectorService) {
		super(service);
		this.subSectorService = subSectorService;
	}	
	
	@PostMapping(path = SubSectorConstant.CREATE_SUB_SECTOR, produces = "application/json")
	public Response<SubSectorResponseDto> createSubSector(@RequestBody SubSectorRequestDto subSectorRequestDto) {
		return subSectorService.createSubSector(subSectorRequestDto);
	}

	@PutMapping(path = SubSectorConstant.UPDATE_SUB_SECTOR, produces = "application/json")
	public Response<SubSectorResponseDto> updateSubSector(@RequestBody SubSectorRequestDto subSectorRequestDto) {
		return subSectorService.updateSubSector(subSectorRequestDto);
	}
	
	@GetMapping(path = SubSectorConstant.GET_ACTIVE_LIST, produces = "application/json")
	public Response<SubSector> findAllByActive() {
		return subSectorService.findAllByActive(false,true);
	}

	@GetMapping(path = SubSectorConstant.GET_SECTOR_BY_SECTOR_ID+"/{subsectorId}", produces = "application/json")
	public Response<SubSectorResponseDto> getBySectorId(@PathVariable("subsectorId") Long subsectorId){
		return subSectorService.findBySectorId(subsectorId);
	}

	@GetMapping("/get-sub-sector-by-id/{id}")
	public Response<SubSectorResponseDto> getSubSectorById(@PathVariable("id") Long id){
		return subSectorService.getSubSectorById(id);
	}

}
