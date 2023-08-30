package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.TappYearCostSummeryConstant;
import com.ibcs.idsdp.dpptapp.model.domain.TappYearCostSummery;
import com.ibcs.idsdp.dpptapp.services.TappYearCostSummeryService;
import com.ibcs.idsdp.dpptapp.web.dto.TappYearCostSummeryDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(TappYearCostSummeryConstant.YEAR_COST_SUMMERY)
public class TappYearCostSummeryController extends BaseController<TappYearCostSummery, TappYearCostSummeryDTO> {

    private final TappYearCostSummeryService tappYearCostSummeryService;

    public TappYearCostSummeryController(BaseService<TappYearCostSummery, TappYearCostSummeryDTO> baseService, TappYearCostSummeryService tappYearCostSummeryService) {
        super(baseService);
        this.tappYearCostSummeryService = tappYearCostSummeryService;
    }


//    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
//    public TappYearCostSummeryDTO create(@RequestBody TappYearCostSummeryDTO tappYearCostSummeryDTO) {
//        tappYearCostSummeryDTO.setStatus(true);
//        return super.create(tappYearCostSummeryDTO);
//    }

    @GetMapping(path = TappYearCostSummeryConstant.GET_BY_PROJECT_SUMMARY_UUID + "/{projectSummaryId}" , produces = "application/json")
    public ResponseWithResults getByProjectSummaryUuid(@PathVariable Long projectSummaryId) {
        System.out.println(projectSummaryId);
        return tappYearCostSummeryService.getYearCostSummery(projectSummaryId);
    }
}
