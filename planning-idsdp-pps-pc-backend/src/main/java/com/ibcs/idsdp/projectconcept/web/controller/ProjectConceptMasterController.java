package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.IdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.client.DppClientService;
import com.ibcs.idsdp.projectconcept.constants.ProjectConceptMasterConstant;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptMaster;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.services.ProjectConceptMasterService;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptMasterDTO;
import com.ibcs.idsdp.projectconcept.web.dto.pageable.PageableResponse;
import com.ibcs.idsdp.projectconcept.web.dto.request.*;
import com.ibcs.idsdp.projectconcept.web.dto.response.ResponseStatusDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestApiController
@RequestMapping(ProjectConceptMasterConstant.PROJECT_CONCEPT)
public class ProjectConceptMasterController extends BaseController<ProjectConceptMaster, ProjectConceptMasterDTO> {

    private final ProjectConceptMasterService projectConceptMasterService;
    private final ProjectConceptMasterRepository projectConceptMasterRepository;
    private final DppClientService dppClientService;

    public ProjectConceptMasterController(BaseService<ProjectConceptMaster, ProjectConceptMasterDTO> baseService, ProjectConceptMasterRepository projectConceptMasterRepository, ProjectConceptMasterService projectConceptMasterService
                                            ,DppClientService dppClientService) {
        super(baseService);
        this.projectConceptMasterService = projectConceptMasterService;
        this.projectConceptMasterRepository = projectConceptMasterRepository;
        this.dppClientService = dppClientService;
    }

    // Getting project summary by project type
    @PostMapping(path = ProjectConceptMasterConstant.PROJECT_SUMMARY_LIST_BY_PROJECT_TYPE, produces = "application/json")
    public Page<ProjectConceptMasterDTO> getProjectSummaryByProjectType(@RequestBody ProjectSummarySearchRequest request) {
        return projectConceptMasterService.getProjectSummaryByProjectType(request);
    }

    // Getting project summary by sector division
    @PostMapping(path = ProjectConceptMasterConstant.PROJECT_SUMMARY_LIST_BY_SECTOR_DIVISION, produces = "application/json")
    public Page<ProjectConceptMasterDTO> getProjectSummaryBySectorDivision(@RequestBody ProjectSummarySearchRequest request) {
        return projectConceptMasterService.getProjectSummaryBySectorDivision(request);
    }

    // Getting project summary by foreign aid
    @PostMapping(path = ProjectConceptMasterConstant.PROJECT_SUMMARY_LIST_BY_FOREIGN_AID, produces = "application/json")
    public Page<ProjectConceptMasterDTO> getProjectSummaryByForeignAid(@RequestBody PageableRequestBodyDTO request) {
        return projectConceptMasterService.getProjectSummaryByForeignAid(request);
    }

    // Getting project summary by gob
    @PostMapping(path = ProjectConceptMasterConstant.PROJECT_SUMMARY_LIST_BY_GOB, produces = "application/json")
    public Page<ProjectConceptMasterDTO> getProjectSummaryByGoB(@RequestBody PageableRequestBodyDTO request) {
        return projectConceptMasterService.getProjectSummaryByGoB(request);
    }

    //criteria based search for project concept, feasibility study and dpp/tapp
    @PostMapping(path = ProjectConceptMasterConstant.PROJECT_SUMMARY_CRITERIA_BASED_SEARCH, produces = "application/json")
    public Page<ProjectConceptMasterDTO> criteriaBasedSearch(@RequestBody PsFsListSearchRequest request) {
        return projectConceptMasterService.criteriaBasedSearch(request);
    }


    @PostMapping(path = ProjectConceptMasterConstant.APPLY_FILTER, produces = "application/json")
    public  Page<ProjectConceptMasterDTO> applyFilter(@RequestBody SearchWithPageableRequest request) {
        return projectConceptMasterService.applyFilter(request);
    }

    @GetMapping(path = ProjectConceptMasterConstant.APPROVED_PROJECT_CONCEPTS, produces = "application/json")
    public List<ProjectConceptMaster> getAllApprovedProjectConceptList(){
        ResponseWithResults response = (ResponseWithResults) dppClientService.getApprovedProjectConcepts();
        List<Integer> projectConceptIds = (List<Integer>) response.getRes();
        List<ProjectConceptMaster> projectConceptMasterList = projectConceptIds.stream().map(projectConceptId -> {return projectConceptMasterRepository.findByIdAndIsDeleted(Long.parseLong(((Integer) projectConceptId).toString()),false).get();} ).collect(Collectors.toList());
        return  projectConceptMasterList;
    }

    @GetMapping(path = ProjectConceptMasterConstant.PROJECT_CONCEPT_ID_LIST_BY_AGENCY + "/{agencyId}")
    public Set<Long> getProjectConceptIdListByAgency(@PathVariable Long agencyId){
        return projectConceptMasterService.getProjectConceptIdListByAgency(agencyId);
    }

    @GetMapping(path = ProjectConceptMasterConstant.GET_NON_APPROVED_DPP_TAPP_PROJECT_CONCEPT, produces = "application/json")
    public List<ProjectConceptMasterDTO> getNonApprovedDppTapp() {
        return projectConceptMasterService.getNonApprovedDppTapp();
    }

    @GetMapping(path = ProjectConceptMasterConstant.GET_APPROVED_DPP_TAPP_PROJECT_CONCEPT, produces = "application/json")
    public List<ProjectConceptMasterDTO> getApprovedDppTapp() {
        return projectConceptMasterService.getApprovedDppTapp();
    }

    @GetMapping(path = ProjectConceptMasterConstant.GET_APPROVED_DPP_TAPP_FOR_EMPIS, produces = "application/json")
    public List<ProjectConceptMasterDTO> getApprovedDppTappForEpims() {
        return projectConceptMasterService.getApprovedDppTappForEpims();
    }

    @GetMapping(path = ProjectConceptMasterConstant.GET_DPP_TAPP_FOR_SMPIS, produces = "application/json")
    public List<ProjectConceptMasterDTO> getDppTappForSpims() {
        return projectConceptMasterService.getDppTappForSpims();
    }

    @GetMapping(path = ProjectConceptMasterConstant.GET_PROJECT_CONCEPT_BY_PPS_CODE+"/{ppsCode}", produces = "application/json")
    public ProjectConceptMasterDTO getProjectConceptByPpsCode(@PathVariable String ppsCode) {
        return projectConceptMasterService.getProjectConceptByPpsCode(ppsCode);
    }

    @GetMapping(path = ProjectConceptMasterConstant.GET_PROJECT_CONCEPT_BY_PPS_ID + "/{ppsId}")
    public ProjectConceptMasterDTO getProjectConceptByPpsId(@PathVariable Long ppsId) {
        return projectConceptMasterService.getProjectConceptByPpsId(ppsId);
    }

    @PostMapping(path = ProjectConceptMasterConstant.APPLY_MIS_QUERY, produces = "application/json")
    public PageableResponse applyMisQuery(@RequestBody MisQueryRequest query) {
        return projectConceptMasterService.applyMisQuery(query);
    }

    @PostMapping(path = ProjectConceptMasterConstant.APPROVAL_PROJECT_ACKNOWLEDGEMENT, produces = "application/json")
    public ResponseStatusDTO ecnecApprovalProjectAcknowledgement(@RequestBody ProjectListDTO projectDTO) {
        return projectConceptMasterService.ecnecApprovalProjectAcknowledgement(projectDTO);
    }

    @PostMapping(path = ProjectConceptMasterConstant.UPDATE_PROJECT_CONCEPT_SHORT_INFO, produces = "application/json")
    public ProjectConceptMasterDTO updateProjectShortInfo(@RequestBody ProjectConceptShortInfoDTO request) {
        return projectConceptMasterService.updateProjectShortInfo(request);
    }

    @PostMapping(path = ProjectConceptMasterConstant.UPDATE_MOVEMENT_TIME_BY_PC_ID, produces = "application/json")
    public ProjectConceptMasterDTO updateMovementTimeByPcId(@RequestBody IdHolderRequestBodyDTO request) {
        return projectConceptMasterService.updateMovementTimeByPcId(request.getId());
    }

    @PostMapping(path = ProjectConceptMasterConstant.UPDATE_AMS_ID_BY_PPS_ID, produces = "application/json")
    public ProjectConceptMasterDTO updateAmsIdByPpsId(@RequestBody PpsIdAmsIdDTO request) {
        return projectConceptMasterService.updateAmsIdByPpsId(request);
    }

    @GetMapping(path = ProjectConceptMasterConstant.GET_PROJECT_BY_AGENCY)
    public List<ProjectConceptMasterDTO> getProjectByAgency() {
        return projectConceptMasterService.getProjectByAgency();
    }

    @PostMapping(path = ProjectConceptMasterConstant.UPDATE_EPIMS_CODE_BY_PPS_CODE, produces = "application/json")
    public ProjectConceptMasterDTO updateEpimsCodeByPpsCode(@RequestBody PpsCodeEpimsCodeDTO request) {
        return projectConceptMasterService.updateEpimsCodeByPpsCode(request);
    }

    @PostMapping(path = ProjectConceptMasterConstant.SAVE_PLIS_PDF_URL, produces = "application/json")
    public ProjectConceptMasterDTO savePlisPdfUrl(@RequestBody PlisRequestDTO request) {
        return projectConceptMasterService.savePlisPdfUrl(request);
    }

}
