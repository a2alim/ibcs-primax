package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.FiscalYearConstant;
import com.ibcs.idsdp.rmsConfigration.constants.FiscalYearWiseBudgetConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYearWiseBudget;
import com.ibcs.idsdp.rmsConfigration.services.FiscalYearService;
import com.ibcs.idsdp.rmsConfigration.services.FiscalYearWiseBudgetService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.FiscalRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.FiscalYearWiseBudgetRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.FiscalYearWiseBudgetResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(FiscalYearWiseBudgetConstant.FISCAL_YEAR_BUDGET)
public class FiscalYearWiseBudgetController extends BaseController<FiscalYearWiseBudget, FiscalYearWiseBudgetRequestDto, FiscalYearWiseBudgetResponseDto> {

	final private FiscalYearWiseBudgetService fiscalYearWiseBudgetService;

	public FiscalYearWiseBudgetController(BaseService<FiscalYearWiseBudget, FiscalYearWiseBudgetRequestDto, FiscalYearWiseBudgetResponseDto> service, FiscalYearWiseBudgetService fiscalYearWiseBudgetService) {
		super(service);
		this.fiscalYearWiseBudgetService = fiscalYearWiseBudgetService;
	}

	@PostMapping(path =FiscalYearWiseBudgetConstant.FISCAL_YEAR_UNIQUE_BUDGET, produces = "application/json")
	public Response<FiscalYearWiseBudgetResponseDto> createFiscalBudgetYear(@RequestBody FiscalYearWiseBudgetRequestDto fiscalYearWiseBudgetRequestDto){
		return fiscalYearWiseBudgetService.createFiscalYearWiseBudget(fiscalYearWiseBudgetRequestDto);
	}
	@PutMapping(path = FiscalYearWiseBudgetConstant.UPDATE_FISCAL_YEAR_UNIQUE_BUDGET, produces = "application/json")
	public Response<FiscalYearWiseBudgetResponseDto> updateFiscalYearBudget(@RequestBody FiscalYearWiseBudgetRequestDto fiscalYearWiseBudgetRequestDto){
		return fiscalYearWiseBudgetService.updateFiscalYearWiseBudget(fiscalYearWiseBudgetRequestDto);
	}

	@GetMapping(path = FiscalYearWiseBudgetConstant.ACTIVE_FISCAL_YEAR_BUDGET, produces = "application/json")
	public Response<FiscalYearWiseBudget> findAllByActive() {
		return fiscalYearWiseBudgetService.findAllByActive(false,true);
	}

}
