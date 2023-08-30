package com.ibcs.idsdp.dpptapp.web.controller;
/**
 * @author Moniruzzaman Rony
 */

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.DppAnnualPhasingCostTabDetailsConstant;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTabDetails;
import com.ibcs.idsdp.dpptapp.services.DppAnnualPhasingCostTabDetailsService;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTabDetailsDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(DppAnnualPhasingCostTabDetailsConstant.DPP_ANNUAL_PHASING_COST_TAB_DETAILS)
public class DppAnnualPhasingCostTabDetailsController extends BaseController<DppAnnualPhasingCostTabDetails, DppAnnualPhasingCostTabDetailsDTO> {

    private final DppAnnualPhasingCostTabDetailsService service;

    public DppAnnualPhasingCostTabDetailsController(BaseService<DppAnnualPhasingCostTabDetails, DppAnnualPhasingCostTabDetailsDTO> baseService, DppAnnualPhasingCostTabDetailsService service) {
        super(baseService);
        this.service = service;
    }

    @GetMapping(DppAnnualPhasingCostTabDetailsConstant.GET_ALL_BY_PROJECT_CONCEPT_ID_AND_IS_MAJOR + "/{projectConceptId}" + "/{isBasis}" + "/{isMajor}")
    public ResponseEntity<List<DppAnnualPhasingCostTabDetailsDTO>> getByProjectConceptIdAndIsMajor(
            @PathVariable Long projectConceptId,
            @PathVariable Boolean isBasis,
            @PathVariable Boolean isMajor) {
        return service.getByProjectConceptIdAndIsBasisOrIsMajor(projectConceptId, isBasis, isMajor);
    }


}
