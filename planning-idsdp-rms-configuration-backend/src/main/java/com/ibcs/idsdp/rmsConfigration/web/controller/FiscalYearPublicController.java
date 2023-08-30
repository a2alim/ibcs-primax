package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.model.domain.SectorType;
import com.ibcs.idsdp.rmsConfigration.services.FiscalYearService;
import com.ibcs.idsdp.rmsConfigration.services.ResearchCategoryTypeService;
import com.ibcs.idsdp.rmsConfigration.services.SectorTypeService;
import com.ibcs.idsdp.rmsConfigration.services.SubSectorService;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.SubSectorResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@AllArgsConstructor
@RequestMapping("public")
class FiscalYearPublicController {

	private final FiscalYearService yearService;
	private final ResearchCategoryTypeService researchCategoryTypeService;
	private final SectorTypeService sectorTypeService;

	private final SubSectorService subSectorService;

	@GetMapping("/get-all-active-fiscal-year")
	public Response<FiscalYear> findAllByActive() {
		return yearService.findAllByActive(false);
	}

	@GetMapping("/get-all-categories")
	public Response<ResearchCategoryType> findAllByActiveDatas() {
		return researchCategoryTypeService.findAllByActive(false, true);
	}

	@GetMapping("/get-sectors")
	public Response<SectorType> findAllSectorsByActive() {
		return sectorTypeService.findAllByActive(false,true);
	}

	@GetMapping("/get-sub-sectors/{sectorId}")
	public Response<SubSectorResponseDto> findAllSubSectorsByActiveId(@PathVariable("sectorId") Long sectorId){
		return subSectorService.findBySectorId(sectorId);
	}

}
