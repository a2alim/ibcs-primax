package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.ExpenditureCostConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.ExpenditureCost;
import com.ibcs.idsdp.feasibilitystudy.services.ExpenditureCostService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.ExpenditureCostDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.ExpenditureCostRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(ExpenditureCostConstant.EXPENDITURE_COST)
public class ExpenditureCostController extends BaseController<ExpenditureCost, ExpenditureCostDTO> {

    private final ExpenditureCostService expenditureCostService;

    public ExpenditureCostController(BaseService<ExpenditureCost, ExpenditureCostDTO> baseService, ExpenditureCostService expenditureCostService) {
        super(baseService);
        this.expenditureCostService = expenditureCostService;
    }

    /**
     * For get expenditure cost by fs proposal master id
     * @param
     */
    @PostMapping(path = ExpenditureCostConstant.GET_EXPENDITURE_COST_LIST, produces = "application/json")
    public Page<ExpenditureCostDTO> getExpenditureCostList(@RequestBody ExpenditureCostRequest request) {
        return expenditureCostService.getExpenditureCostByFspMasterId(request);
    }


    @GetMapping(path = ExpenditureCostConstant.GET_EXPENDITURE_COST_LIST_By_FSM_ID+"{id}")
    public  List<ExpenditureCost> getByPsMasterId(@PathVariable Long id){
        return expenditureCostService.getByPsMasterId(id);
    }
}
