package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.ModeOfFinanceConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.ModeOfFinance;
import com.ibcs.idsdp.feasibilitystudy.services.ModeOfFinanceService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.ModeOfFinanceDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.ModeOfFianceRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(ModeOfFinanceConstant.FSP_MODE_OF_FINANCE)
public class ModeOfFinanceController extends BaseController<ModeOfFinance, ModeOfFinanceDTO> {
    private final ModeOfFinanceService modeOfFinanceService;

    public ModeOfFinanceController(BaseService<ModeOfFinance, ModeOfFinanceDTO> baseService, ModeOfFinanceService modeOfFinanceService) {
        super(baseService);
        this.modeOfFinanceService = modeOfFinanceService;
    }

    @PostMapping(path = ModeOfFinanceConstant.MODE_OF_FINANCE_LIST_BY_FSP_MASTER_ID, produces = "application/json")
    public Page<ModeOfFinanceDTO> getModeOfFinanceByFspMasterId(@RequestBody ModeOfFianceRequest request) {
        return modeOfFinanceService.getModeOfFinanceByFspMasterId(request);
    }

    @GetMapping(path = ModeOfFinanceConstant.GET_MODE_OF_FINANCE_LIST_BY_FSP_MASTER_ID+"{id}" )
    public List<ModeOfFinance> getModeOfFinanceListByFsMasterId(@PathVariable Long id){
        return modeOfFinanceService.getModeOfFinanceListByFsMasterId(id);
    }
}
