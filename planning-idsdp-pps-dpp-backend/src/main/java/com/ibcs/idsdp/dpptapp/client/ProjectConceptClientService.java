package com.ibcs.idsdp.dpptapp.client;

import com.ibcs.idsdp.common.web.dto.request.IdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.client.dto.response.ProjectLocationResponse;
import com.ibcs.idsdp.dpptapp.web.dto.misDTO.MisQueryRequest;
import com.ibcs.idsdp.dpptapp.web.dto.misDTO.PcPageableResponse;
import com.ibcs.idsdp.dpptapp.web.dto.request.PlisRequestDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.PpsCodeEpimsCodeDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.PpsIdAmsIdDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectConceptShortInfoDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectListDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ResponseStatusDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@FeignClient(value = "PLANNING-IDSDP-PPS-PC-BACKEND", url = "${feign.client.project-concept}")
//@FeignClient( value = "PLANNING-IDSDP-PPS-PC-BACKEND", url = "http://localhost:8085/pps-pc/")
public interface ProjectConceptClientService {

    @GetMapping("projectLocation/getByProjectSummaryId/{projectSummaryId}")
    public @ResponseBody
    ProjectLocationResponse getByProjectSummaryId(@PathVariable Long projectSummaryId);

    @GetMapping("projectConcept/get-by-uuid/{uuid}")
    public @ResponseBody
    ProjectConceptResponse getProjectConceptMasterId(@PathVariable String uuid);

    @GetMapping("projectConcept/projectConceptIdListByAgency/{agencyId}")
    public @ResponseBody
    Set<Long> getProjectConceptIdListByAgency(@PathVariable Long agencyId);

    @GetMapping("projectConcept/get-non-approved-dpp-tapp-project-concept")
    public @ResponseBody
    List<ProjectConceptResponse> getNonApprovedDppTapp();

    @GetMapping("projectConcept/get-approved-dpp-tapp-project-concept")
    public @ResponseBody
    List<ProjectConceptResponse> getApprovedDppTapp();

    @GetMapping("projectConcept/get-approved-dpp-tapp-for-epims")
    public @ResponseBody
    List<ProjectConceptResponse> getApprovedDppTappForEpims();

    @GetMapping("projectConcept/get-dpp-tapp-for-spims")
    public @ResponseBody
    List<ProjectConceptResponse> getDppTappForSpims();

    @GetMapping("projectConcept/get-project-concept-by-pps-code/{ppsCode}")
    public @ResponseBody
    ProjectConceptResponse getProjectConceptByPpsCode(@PathVariable String ppsCode);

    @GetMapping("projectConcept/get-project-concept-by-pps-id/{ppsId}")
    public @ResponseBody
    ProjectConceptResponse getProjectConceptByPpsId(@PathVariable Long ppsId);

    @GetMapping("projectConcept/apply-mis-query")
    public @ResponseBody
    PcPageableResponse applyMisQuery(@RequestBody MisQueryRequest request);

    @PostMapping("projectConcept/approvalProjectAcknowledgement")
    public @ResponseBody
    ResponseStatusDTO ecnecApprovalProjectAcknowledgement(@RequestBody ProjectListDTO projectDTO);

    @PostMapping("projectConcept/updateProjectConceptShortInfo")
    public @ResponseBody
    ProjectConceptResponse updateProjectShortInfo(@RequestBody ProjectConceptShortInfoDTO request);

    @PostMapping("projectConcept/updateMovementTimeByPcId")
    public @ResponseBody ProjectConceptResponse updateMovementTimeByPcId(@RequestBody IdHolderRequestBodyDTO request);

    @PostMapping("projectConcept/updateAmsIdByPpsId")
    public @ResponseBody
    ProjectConceptResponse updateAmsIdByPpsId(@RequestBody PpsIdAmsIdDTO request);

    @PostMapping("projectConcept/updateEpimsCodeByPpsCode")
    public @ResponseBody
    ProjectConceptResponse updateEpimsCodeByPpsCode(@RequestBody PpsCodeEpimsCodeDTO request);

    @PostMapping("projectConcept/savePlisPdfUrl")
    public @ResponseBody
    ProjectConceptResponse savePlisPdfUrl(@RequestBody PlisRequestDTO request);

}
