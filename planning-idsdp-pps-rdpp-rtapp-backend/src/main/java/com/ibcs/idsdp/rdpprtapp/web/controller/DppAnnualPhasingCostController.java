package com.ibcs.idsdp.rdpprtapp.web.controller;
/**
 * @author Moniruzzaman Rony
 */

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.DppAnnualPhasingCostConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAnnualPhasingCost;
import com.ibcs.idsdp.rdpprtapp.services.DppAnnualPhasingCostService;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppAnnualPhasingCostWithChildRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(DppAnnualPhasingCostConstant.dppAnnualPhasingCostConstant)
public class DppAnnualPhasingCostController extends BaseController<DppAnnualPhasingCost, DppAnnualPhasingCostDTO> {

    private final DppAnnualPhasingCostService service;

    public DppAnnualPhasingCostController(BaseService<DppAnnualPhasingCost, DppAnnualPhasingCostDTO> baseService, DppAnnualPhasingCostService service) {
        super(baseService);
        this.service = service;
    }


    @Transactional
    @PostMapping(DppAnnualPhasingCostConstant.CREATE_WITH_CHILD)
    public ResponseEntity<DppAnnualPhasingCostWithChildResponse> saveAnnualPhasing(@RequestBody DppAnnualPhasingCostWithChildRequest request) {
        return service.saveWithChild(request);
    }

    @Transactional
    @PostMapping(DppAnnualPhasingCostConstant.UPDATE_WITH_CHILD)
    public ResponseEntity<DppAnnualPhasingCostWithChildResponse> updateWithChild(@RequestBody DppAnnualPhasingCostWithChildRequest request) {
        return service.updateWithChild(request);
    }

    @PostMapping(DppAnnualPhasingCostConstant.GET_BY_PROJECT_CONCEPT_ID_AND_COMPONENT_NAME)
    public ResponseEntity<DppAnnualPhasingCostWithChildResponse> getByProjectConceptIdAndComponentName(@RequestBody ProjectConceptIdAndComponentNameRequest request) {
        return service.getByProjectConceptIdAndComponentName(request);
    }

    @GetMapping(DppAnnualPhasingCostConstant.GET_ALL_BY_PROJECT_CONCEPT_ID + "/{conceptId}")
    public ResponseEntity<List<DppAnnualPhasingCostEconomicCodeWise>> getAllByProjectConceptIdArrangedEconomicCodeWise(@PathVariable Long conceptId) {
        return service.getAllByProjectConceptIdArrangedEconomicCodeWise(conceptId);
    }

    @GetMapping(DppAnnualPhasingCostConstant.GET_GRAND_TOTAL_BY_PROJECT_CONCEPT_ID + "/{rdppMasterId}")
    public ResponseEntity<List<GrandTotalResponse>> getByRdppMasterIdAndComponentName(@PathVariable Long rdppMasterId) {
        return service.getGrandTotalByRdppMasterId(rdppMasterId);
    }

    @GetMapping(DppAnnualPhasingCostConstant.GET_BY_PROJECT_CONCEPT_ID_FOR_CHECKING_FISCAL_YEAR + "/{conceptId}")
    public ResponseEntity<List<FiscalYearResponse>> getByProjectConceptIdForGettingFiscalYear(@PathVariable Long conceptId) {
        return service.getByProjectConceptIdForGettingFiscalYear(conceptId);
    }

    @GetMapping(DppAnnualPhasingCostConstant.GET_YEAR_WISE_PHYSICAL_AND_FINANCIAL_TARGET_BY_PROJECT_CONCEPT_ID + "/{conceptId}")
    public ResponseEntity<List<YearWisePhysicalAndFinancialTarget>> getYearWisePhysicalAndFinancialTargetByProjectConceptId(@PathVariable Long conceptId) {
        return service.getYearWisePhysicalAndFinancialTargetByProjectConceptId(conceptId);
    }
    /**
     * For Get Annual Phasing
     * @return ResponseEntity<List<DppAnnualPhasingCost>>
     */
    @GetMapping("/getAll")
    private ResponseEntity<List<DppAnnualPhasingCost>> getAnnualPhasing() {
        return service.getAnnualPhasing();
    }

    /**
     * For Get Grand Total Annual Phasing By Id
     * @param conceptId
     * @return DppGrandTotalResponse
     */
    @GetMapping("/getGrandTotalAnnuals/{conceptId}")
    private ResponseEntity<DppGrandTotalResponse> getGrandTotalAnnualPhasingById(@PathVariable("conceptId") String conceptId) {

        return service.getGrandTotalAnnualPhasingById(conceptId);
    }

    /**
     * For Get Contingency
     * @param conceptId
     * @return
     */
    @GetMapping("/contingency/concepts/{conceptId}")
    private ResponseEntity<List<DppContingencyResponse>> getContingency(@PathVariable("conceptId") String conceptId) {
        return service.getContingency(conceptId);
    }

    /**
     * For Get Contingency
     * @param projectConceptUuid
     * @return
     */
    @GetMapping(DppAnnualPhasingCostConstant.getAllByProjectConceptUuid +"/{projectConceptUuid}")
    private List<DppAnnualPhasingCost> getAllByProjectConceptUuid(@PathVariable String projectConceptUuid) {
        return service.getAllByPCUuid(projectConceptUuid);
    }

    /**
     * For Get Contingency
     * Type
     * @param projectConceptUuid
     * @param type
     * @return
     */
    @GetMapping(DppAnnualPhasingCostConstant.getAnnualPhasingCostByPCUuidAndComponentType +"/{projectConceptUuid}" + "/{type}")
    private DppAnnualPhasingCost getAnnualPhasingCostByPCUuidAndComponentType(@PathVariable String projectConceptUuid, @PathVariable String type) {
        return service.getAnnualPhasingCostByPCUuidAndComponentType(projectConceptUuid, type);
    }

    @GetMapping("getDetailsEstimatedCost" + "/{id}")
    public DetailsEstimatedCostResponse getDetailsEstimatedCost(@PathVariable Long id) {
        return service.getDetailsEstimatedCost(id);
    }

    @GetMapping("get-grand-total-by-master-id/{rdppMasterId}")
    public ResponseEntity<GrandTotalDifferenceResponse> getGrandTotalByMasterId(@PathVariable Long rdppMasterId) {
        return service.getGrandTotalByMasterId(rdppMasterId);
    }

    @GetMapping("get-year-wise-estimated-cost-by/{pcUuid}")
    public ResponseEntity<List<GrandTotalResponse>> getYearWiseEstimatedCost(@PathVariable String pcUuid){
        return service.getYearWiseEstimatedCost(pcUuid);
    }


}
