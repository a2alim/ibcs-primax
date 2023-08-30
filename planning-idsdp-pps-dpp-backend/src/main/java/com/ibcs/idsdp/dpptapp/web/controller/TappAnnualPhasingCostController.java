package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.TappAnnualPhasingCostConstant;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnualPhasingCost;
import com.ibcs.idsdp.dpptapp.services.TappAnnualPhasingCostService;
import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappAnnualPhasingCostWithChildRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(TappAnnualPhasingCostConstant.tappAnnualPhasingCostConstant)
public class TappAnnualPhasingCostController extends BaseController<TappAnnualPhasingCost, TappAnnualPhasingCostDTO> {

    private final TappAnnualPhasingCostService service;

    public TappAnnualPhasingCostController(BaseService<TappAnnualPhasingCost, TappAnnualPhasingCostDTO> baseService, TappAnnualPhasingCostService service) {
        super(baseService);
        this.service = service;
    }


    @Transactional
    @PostMapping(TappAnnualPhasingCostConstant.CREATE_WITH_CHILD)
    public ResponseEntity<TappAnnualPhasingCostWithChildResponse> saveAnnualPhasing(@RequestBody TappAnnualPhasingCostWithChildRequest request) {
        return service.saveWithChild(request);
    }

    @Transactional
    @PostMapping(TappAnnualPhasingCostConstant.UPDATE_WITH_CHILD)
    public ResponseEntity<TappAnnualPhasingCostWithChildResponse> updateWithChild(@RequestBody TappAnnualPhasingCostWithChildRequest request) {
        return service.updateWithChild(request);
    }

    @PostMapping(TappAnnualPhasingCostConstant.GET_BY_PROJECT_CONCEPT_ID_AND_COMPONENT_NAME)
    public ResponseEntity<TappAnnualPhasingCostWithChildResponse> getByProjectConceptIdAndComponentName(@RequestBody ProjectConceptIdAndComponentNameRequest request) {
        return service.getByProjectConceptIdAndComponentName(request);
    }

    @GetMapping(TappAnnualPhasingCostConstant.GET_GRAND_TOTAL_BY_PROJECT_CONCEPT_ID + "/{conceptId}")
    public ResponseEntity<List<GrandTotalResponseTapp>> getByProjectConceptIdAndComponentName(@PathVariable Long conceptId) {
        return service.getGrandTotalByProjectConceptId(conceptId);
    }

    @GetMapping(TappAnnualPhasingCostConstant.GET_BY_PROJECT_CONCEPT_ID_FOR_CHECKING_FISCAL_YEAR + "/{conceptId}")
    public ResponseEntity<List<FiscalYearResponse>> getByProjectConceptIdForGettingFiscalYear(@PathVariable Long conceptId) {
        return service.getByProjectConceptIdForGettingFiscalYear(conceptId);
    }

//
//    /**
//     * For Save Annual Phasing
//     * @param dppAnnualPhasingCostDTO
//     * @return ResponseEntity<IdentityResponse>
//     */
//    @PostMapping("/create")
//    private ResponseEntity<IdentityResponse> saveAnnualPhasing(@RequestBody DppAnnualPhasingCostDTO dppAnnualPhasingCostDTO) {
//        return service.saveAnnualPhasing(dppAnnualPhasingCostDTO);
//    }

    /**
     * For Get Annual Phasing
     *
     * @return ResponseEntity<List < DppAnnualPhasingCost>>
     */
    @GetMapping("/getAll")
    private ResponseEntity<List<TappAnnualPhasingCost>> getAnnualPhasing() {
        return service.getAnnualPhasing();
    }

    /**
     * For Get Grand Total Annual Phasing By Id
     *
     * @param conceptId
     * @return TappGrandTotalResponse
     */
    @GetMapping("/getGrandTotalAnnuals/{conceptId}")
    private ResponseEntity<TappGrandTotalResponse> getGrandTotalAnnualPhasingById(@PathVariable("conceptId") String conceptId) {

        return service.getGrandTotalAnnualPhasingById(conceptId);
    }

    /**
     * For Get Contingency
     *
     * @param conceptId
     * @return
     */
    @GetMapping("/contingency/concepts/{conceptId}")
    private ResponseEntity<List<TappContingencyResponse>> getContingency(@PathVariable("conceptId") String conceptId) {
        return service.getContingency(conceptId);
    }

    /**
     * For Get Contingency
     *
     * @param projectConceptUuid
     * @return
     */
    @GetMapping(TappAnnualPhasingCostConstant.getAllByProjectConceptUuid + "/{projectConceptUuid}")
    private List<TappAnnualPhasingCost> getAllByProjectConceptUuid(@PathVariable String projectConceptUuid) {
        return service.getAllByPCUuid(projectConceptUuid);
    }

    /**
     * For Get Contingency
     * Type
     *
     * @param projectConceptUuid
     * @param type
     * @return
     */
    @GetMapping(TappAnnualPhasingCostConstant.getAnnualPhasingCostByPCUuidAndComponentType + "/{projectConceptUuid}" + "/{type}")
    private TappAnnualPhasingCost getAnnualPhasingCostByPCUuidAndComponentType(@PathVariable String projectConceptUuid, @PathVariable String type) {
        return service.getAnnualPhasingCostByPCUuidAndComponentType(projectConceptUuid, type);
    }

    @GetMapping("getDetailsEstimatedCost" + "/{projectConceptUuid}")
    public DetailsEstimatedCostResponse getDetailsEstimatedCost(@PathVariable String projectConceptUuid) {
        return service.getDetailsEstimatedCost(projectConceptUuid);
    }


}
