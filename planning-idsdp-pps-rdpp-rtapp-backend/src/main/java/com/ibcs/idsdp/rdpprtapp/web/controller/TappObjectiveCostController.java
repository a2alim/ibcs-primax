package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.TappObjectiveCostConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.services.TappObjectiveCostService;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.MainFeaturesRevisionDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappObjectiveCostDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestApiController
@RequestMapping(TappObjectiveCostConstant.TAPP_OBJECTIVE_COST)
public class TappObjectiveCostController extends BaseController<TappObjectiveCost, TappObjectiveCostDTO> {

    private final TappObjectiveCostService tappObjectiveCostService;

    public TappObjectiveCostController(BaseService<TappObjectiveCost, TappObjectiveCostDTO> baseService, TappObjectiveCostService tappObjectiveCostService) {
        super(baseService);
        this.tappObjectiveCostService = tappObjectiveCostService;
    }

    @PostMapping(path = "save", produces = "application/json")
    public ResponseWithResults createObjectiveCost(@RequestBody TappObjectiveCostDTO tappObjectiveCostDTO) {
        return tappObjectiveCostService.createObjectiveCost(tappObjectiveCostDTO);
    }

    @PostMapping(path = "update", produces = "application/json")
    public ResponseWithResults updateObjectiveCost(@RequestBody TappObjectiveCostDTO tappObjectiveCostDTO) {
        return tappObjectiveCostService.updateObjectiveCost(tappObjectiveCostDTO);
    }

    @GetMapping(path = "get-by-rtapp-id/{id}")
    public ResponseWithResults getByPcUuid(@PathVariable Long id) {
        return tappObjectiveCostService.getByPcUuid(id);
    }

    @DeleteMapping("/deleteRow/{uuid}")
    public ResponseEntity<ResponseStatus> deleteRow(@PathVariable String uuid) {
        return tappObjectiveCostService.deleteRow(uuid);
    }

    // all tapp objective and cost master data
    @GetMapping(path = "get-tapp-master-data", produces = "application/json")
    public List<TappObjectiveCostDTO> getObjectiveCostList() {
        return tappObjectiveCostService.getObjectiveCostList();
    }

    // tapp objective and cost master data by project concept uuid
    @GetMapping(path = "get-tapp-master-data/{uuid}/{id}", produces = "application/json")
    public TappObjectiveCostDTO getObjectiveCostByPcUuid(@PathVariable String uuid, @PathVariable Long id) {
        return tappObjectiveCostService.getObjectiveCostByPcUuid(uuid, id);
    }

    // tapp objective and cost master data by project concept uuid
    @GetMapping(path = "get-rtapp-master-data/{rtappMasterId}", produces = "application/json")
    public TappObjectiveCostDTO getObjectiveCostByPcUuid(@PathVariable Long rtappMasterId) {
        return tappObjectiveCostService.getByRtappMasterId(rtappMasterId);
    }

    @PostMapping(path = "get-rtapp-list", produces = "application/json")
    public Page<TappObjectiveCostDTO> getRtappList(@RequestBody PageableRequestBodyDTO requestBodyDTO) {
        return tappObjectiveCostService.getRtappList(requestBodyDTO);
    }

    @GetMapping(path = "check-current-project-version/{id}", produces = "application/json")
    public ResponseWithResults checkCurrentRdppVersion(@PathVariable Long id) {
        String response = tappObjectiveCostService.checkCurrentVersion(id);
        return new ResponseWithResults(200, "Data Found", response);
    }

    @GetMapping("/find-by-id/{id}")
    public Optional<TappObjectiveCost> findById(@PathVariable Long id){
        return tappObjectiveCostService.findById(id);
    }

    @GetMapping("/find-by-reference-id/{referenceId}")
    public Optional<TappObjectiveCost> findByReferenceId(@PathVariable Long referenceId){
        return tappObjectiveCostService.findByReferenceId(referenceId);
    }

    @GetMapping("/find-by-reference-id-and-agency-id/{referenceId}/{agencyId}")
    public Optional<TappObjectiveCost> findByReferenceIdAndAgencyId(@PathVariable Long referenceId, @PathVariable Long agencyId) {
        return tappObjectiveCostService.findByReferenceIdAndAgencyId(referenceId, agencyId);
    }

    @GetMapping("/find-by-project-concept-id/{projectConceptId}")
    public Optional<TappObjectiveCost> findByProjectConceptId(@PathVariable Long projectConceptId){
        return tappObjectiveCostService.findByProjectConceptId(projectConceptId);
    }

    @GetMapping("/find-objective-cost-by-reference-uuid/{referenceUuid}")
    public TappObjectiveCostDTO getByReferenceUuid(@PathVariable String referenceUuid){
        return tappObjectiveCostService.getByReferenceUuid(referenceUuid);
    }

    @GetMapping("/find-objective-cost-by-uuid/{uuid}")
    public ResponseWithResults getObjectiveCostByUuid(@PathVariable String uuid){
        return tappObjectiveCostService.getObjectiveCostByUuid(uuid);
    }

    @GetMapping(path ="/get-cumulative-date/{id}/{pcUuid}", produces = "application/json")
    public ResponseWithResults getCumulativeDate(@PathVariable Long id, @PathVariable String pcUuid) {
        String response = tappObjectiveCostService.getCumulativeDate(id, pcUuid);
        return new ResponseWithResults(200, "Data Found", response);
    }

    @GetMapping(path = "estimated-cost/{pcUuid}", produces = "application/json")
    public List<DppAnnualPhasingCostTotalDTO> getEstimatedCost(@PathVariable String pcUuid) {
        return tappObjectiveCostService.getEstimatedCost(pcUuid);
    }

    @PostMapping(path = "update-main-features-revision", produces = "application/json")
    public TappObjectiveCostDTO updateMainFeaturesRevision(@RequestBody MainFeaturesRevisionDTO request) {
        return tappObjectiveCostService.updateMainFeaturesRevision(request);
    }
}
