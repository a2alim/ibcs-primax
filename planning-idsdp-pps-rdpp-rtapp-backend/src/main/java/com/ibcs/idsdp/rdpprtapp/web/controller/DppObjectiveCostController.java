package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.DppObjectiveCostConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.CommonDppTappSearch;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.services.DppObjectiveCostService;
import com.ibcs.idsdp.rdpprtapp.web.dto.AgencyDashboardDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.FsLinkWithDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.ecnecDTO.EcnecProjectInfoDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectListDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.SearchRequestDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.ApprovalAndNotApprovalProjectListResponseDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.ProjectListResponseDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.ResponseStatusDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.RevisedVersionDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;


@RestApiController
@RequestMapping(DppObjectiveCostConstant.OBJECTIVE_COST)
public class DppObjectiveCostController extends BaseController<DppObjectiveCost, DppObjectiveCostDTO> {

    private final DppObjectiveCostService dppObjectiveCostService;

    public DppObjectiveCostController(BaseService<DppObjectiveCost, DppObjectiveCostDTO> baseService, DppObjectiveCostService dppObjectiveCostService) {
        super(baseService);
        this.dppObjectiveCostService = dppObjectiveCostService;
    }


    /**
     * For create DppObjectiveCost
     *
     * @param dppObjectiveCostDTO
     * @return
     */
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public DppObjectiveCostDTO create(@RequestBody DppObjectiveCostDTO dppObjectiveCostDTO) {
        //System.out.println(dppObjectiveCostDTO);
        return dppObjectiveCostService.createObjectiveCost(dppObjectiveCostDTO);
    }

    /**
     * For update DppObjectiveCost
     *
     * @param dppObjectiveCostDTO
     * @return
     */
    @PostMapping(path = BaseConstant.UPDATE, produces = "application/json")
    public DppObjectiveCostDTO update(@RequestBody DppObjectiveCostDTO dppObjectiveCostDTO) {
        return dppObjectiveCostService.updateObjectiveCost(dppObjectiveCostDTO);
    }

    /**
     * Get By Pcuuid
     *
     * @param pcUuid
     * @return
     */
    @GetMapping("/getByPcuuid/{pcUuid}")
    public ResponseWithResults getByPcuuid(@PathVariable String pcUuid) {
        return dppObjectiveCostService.getObjectivesAndCost(pcUuid);
    }

    @GetMapping("/get-pcUuid-id/{pcUuid}/{id}")
    public ResponseWithResults getObjectivesAndCostByPcUuidAndId(@PathVariable String pcUuid, @PathVariable Long id){
        return dppObjectiveCostService.getObjectivesAndCostByPcUuidAndId(pcUuid, id);
    }

    @DeleteMapping("/delete-dev-partner/{rowUuid}")
    public ResponseEntity<ResponseStatus> deleteDevPartnerRow(@PathVariable String rowUuid) {
        return dppObjectiveCostService.deleteDevPartnerRow(rowUuid);
    }

    // all dpp objective and cost master data
    @GetMapping(path = "get-dpp-master-data", produces = "application/json")
    public List<DppObjectiveCostDTO> getObjectiveCostList() {
        return dppObjectiveCostService.getObjectiveCostList();
    }

    @PostMapping(path = "get-all-stages-by-pc-ids", produces = "application/json")
    public AgencyDashboardDTO getAllStagesByPcIds(@RequestBody AgencyDashboardDTO ids) {
        return dppObjectiveCostService.getAllStagesByPcIds(ids.getIds());
    }

    // dpp objective and cost master data by project concept uuid
    @GetMapping(path = "get-dpp-master-data/{pcUuid}", produces = "application/json")
    public DppObjectiveCostDTO getObjectiveCostByPcUuid(@PathVariable String pcUuid) {
        return dppObjectiveCostService.getObjectiveCostByPcUuid(pcUuid);
    }

    // dpp objective and cost master data by project concept uuid
    @GetMapping(path = "get-dpp-master-data-by/{rdppMasterId}", produces = "application/json")
    public DppObjectiveCostDTO getObjectiveCostByRdppMasterId(@PathVariable Long rdppMasterId) {
        return dppObjectiveCostService.getObjectiveCostByRdppMasterId(rdppMasterId);
    }

    @PostMapping(path = "link-fs-with-dpp", produces = "application/json")
    public ResponseStatus linkFsReportWithDpp(@RequestBody FsLinkWithDto fsLinkWithDto) {
        return dppObjectiveCostService.linkFsReportWithDpp(fsLinkWithDto);
    }

    @PostMapping(path = DppObjectiveCostConstant.GET_RDPP_RTAPP_LIST, produces = "application/json")
    public Page<DppObjectiveCostDTO> getRdppRtappList(@RequestBody PageableRequestBodyDTO requestBodyDTO) {
        return dppObjectiveCostService.getRdppTappList(requestBodyDTO);
    }

    @GetMapping(path = DppObjectiveCostConstant.CHECK_CURRENT_RDPP_VERSION + "/{pcUuid}", produces = "application/json")
    public ResponseWithResults checkCurrentRdppVersion(@PathVariable String pcUuid) {
        RevisedVersionDTO response = dppObjectiveCostService.checkCurrentRdppVersion(pcUuid);
        return new ResponseWithResults(200, "Data Found", response);
    }

    @GetMapping(path = DppObjectiveCostConstant.CHECK_CURRENT_PROJECT_VERSION + "/{id}", produces = "application/json")
    public ResponseWithResults checkCurrentRdppVersion(@PathVariable Long id) {
        String response = dppObjectiveCostService.checkCurrentProjectVersion(id);
        return new ResponseWithResults(200, "Data Found", response);
    }

    @GetMapping(path = DppObjectiveCostConstant.GET_CUMULATIVE_DATE + "/{id}" + "/{pcUuid}", produces = "application/json")
    public ResponseWithResults getCumulativeDate(@PathVariable Long id, @PathVariable String pcUuid) {
        String response = dppObjectiveCostService.getCumulativeDate(id, pcUuid);
        return new ResponseWithResults(200, "Data Found", response);
    }

    /**
     *
     * @param id
     * @return Optional<DppObjectiveCost>
     */
    @GetMapping("/find-by-id/{id}")
    public Optional<DppObjectiveCost> findById(@PathVariable Long id){
        return dppObjectiveCostService.findById(id);
    }

    /**
     *
     * @param referenceId
     * @return Optional<DppObjectiveCost>
     */
    @GetMapping(DppObjectiveCostConstant.FIND_BY_REFERENCE_ID + "/{referenceId}")
    public Optional<DppObjectiveCost> findByReferenceId(@PathVariable Long referenceId){
        return dppObjectiveCostService.findByReferenceId(referenceId);
    }

    @GetMapping(DppObjectiveCostConstant.FIND_BY_REFERENCE_ID_AND_AGENCY_ID + "/{referenceId}" + "/{agencyId}")
    public Optional<DppObjectiveCost> findByReferenceIdAndAgencyId(@PathVariable Long referenceId, @PathVariable Long agencyId){
        return dppObjectiveCostService.findByReferenceIdAndAgencyId(referenceId, agencyId);
    }

    /**
     *
     * @param projectConceptId
     * @return Optional<DppObjectiveCost>
     */
    @GetMapping("/find-by-project-concept-id/{projectConceptId}")
    public Optional<DppObjectiveCost> findByProjectConceptId(@PathVariable Long projectConceptId){
        return dppObjectiveCostService.findByProjectConceptId(projectConceptId);
    }

    /**
     *
     * @param referenceUuid
     * @return DppObjectiveCostDTO
     */
    @GetMapping(path = "find-objective-cost-by-reference-uuid/{referenceUuid}", produces = "application/json")
    public DppObjectiveCostDTO getObjectiveCostByReferenceUuid(@PathVariable String referenceUuid) {
        return dppObjectiveCostService.getObjectiveCostByReferenceUuid(referenceUuid);
    }

    @GetMapping(path = "find-objective-cost-by-uuid/{uuid}", produces = "application/json")
    public ResponseWithResults getObjectiveCostByUuid(@PathVariable String uuid) {
        return dppObjectiveCostService.getObjectiveCostByUuid(uuid);
    }

    @GetMapping(path = "estimated-cost/{pcUuid}", produces = "application/json")
    public List<DppAnnualPhasingCostTotalDTO> getEstimatedCost(@PathVariable String pcUuid) {
        return dppObjectiveCostService.getEstimatedCost(pcUuid);
    }

    @PostMapping(path = DppObjectiveCostConstant.SEARCH_RDPP_RTAPP, produces = "application/json")
    public Page<CommonDppTappSearch> searchRdppRtapp(@RequestBody SearchRequestDTO request) {
        return dppObjectiveCostService.searchRdppRtapp(request);
    }

    @GetMapping(path = "getAllApprovalRevisedProject", produces = "application/json")
    public List<ProjectListResponseDTO> getApprovedRdppRtapp() {
        return dppObjectiveCostService.getApprovedRdppRtapp();
    }

    @GetMapping("getProjectInfoByProjectCode/{project_code}/{project_type}")
    public EcnecProjectInfoDTO getProjectInfoByProjectCode(@PathVariable("project_code") @NotNull String projectCode, @PathVariable("project_type") @NotNull String projectType) {
        return dppObjectiveCostService.getProjectInfoByProjectCode(projectCode, projectType);
    }

    @GetMapping(path = "getAllApprovalAndNotApprovalProjects", produces = "application/json")
    public ApprovalAndNotApprovalProjectListResponseDTO getApprovedNotApprovedRdppRtapp() {
        return dppObjectiveCostService.getApprovedNotApprovedRdppRtapp();
    }

    @PostMapping(path = "rdppRtappApprovalProjectAcknowledgement", produces = "application/json")
    public ResponseStatusDTO ecnecApprovalProjectAcknowledgement(@RequestBody ProjectListDTO projectDTO) {
        return dppObjectiveCostService.ecnecApprovalProjectAcknowledgement(projectDTO);
    }
}
