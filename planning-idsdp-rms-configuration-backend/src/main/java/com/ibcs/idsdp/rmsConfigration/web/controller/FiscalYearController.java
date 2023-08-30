package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.FiscalYearConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.services.FiscalYearService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.FiscalRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(FiscalYearConstant.FISCAL_YEAR)
public class FiscalYearController extends BaseController<FiscalYear, FiscalRequestDto, FiscalResponseDto> {

	final private FiscalYearService yearService;


	public FiscalYearController(BaseService<FiscalYear, FiscalRequestDto, FiscalResponseDto> service, FiscalYearService yearService) {
		super(service);
		this.yearService = yearService;
	}


	@PostMapping(path = FiscalYearConstant.FISCAL_YEAR_UNIQUE, produces = "application/json")
	public Response<FiscalResponseDto> createFiscalYear(@RequestBody FiscalRequestDto fiscalRequestDto ){
		return yearService.createFiscalYear(fiscalRequestDto);
	}
	@PutMapping(path = FiscalYearConstant.UPDATE_FISCAL_YEAR_UNIQUE, produces = "application/json")
	public Response<FiscalResponseDto> updateFiscalYear(@RequestBody FiscalRequestDto fiscalRequestDto){
		return yearService.updateFiscalYear(fiscalRequestDto);
	}

	@GetMapping(path = FiscalYearConstant.ACTIVE_FISCAL_YEAR, produces = "application/json")
	public Response<FiscalYear> findAllByActive() {
		return yearService.findAllByActive(false);
	}

	@GetMapping(path = FiscalYearConstant.FISCAL_YEAR_BY_ID, produces = "application/json")
	public Response<FiscalYear> getFiscalYearById(@PathVariable("id") Long id) {
		return this.getById(id);
	}
}
