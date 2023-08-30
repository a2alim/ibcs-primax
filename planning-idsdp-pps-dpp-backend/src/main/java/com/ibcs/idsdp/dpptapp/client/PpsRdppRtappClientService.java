package com.ibcs.idsdp.dpptapp.client;

import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.client.dto.response.ProjectLocationResponse;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.dpptapp.web.dto.ecnecDTO.EcnecProjectInfoDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectListDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectListResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ResponseStatusDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@FeignClient(value = "PLANNING-IDSDP-PPS-RDPP-RTAPP-BACKEND", url = "${feign.client.pps-rdpp-rtapp}")
public interface PpsRdppRtappClientService {

    @GetMapping("objective-cost/find-by-id/{id}")
    @ResponseBody
    Optional<DppObjectiveCost> findRdppById(@PathVariable Long id);

    @GetMapping("objective-cost/find-by-project-concept-id/{projectConceptId}")
    @ResponseBody
    Optional<DppObjectiveCost> findRdppByProjectConceptId(@PathVariable Long projectConceptId);

    @GetMapping("objective-cost/find-by-reference-id/{referenceId}")
    @ResponseBody
    Optional<DppObjectiveCost> findRdppByReferenceId(@PathVariable Long referenceId);

    @GetMapping("objective-cost/find-by-reference-id-and-agency-id/{referenceId}/{agencyId}")
    @ResponseBody
    Optional<DppObjectiveCost> findRdppByReferenceIdAndAgencyId(@PathVariable Long referenceId, @PathVariable Long agencyId);

    @GetMapping("objective-cost/getAllApprovalRevisedProject")
    @ResponseBody
    List<ProjectListResponseDTO> getAllApprovalRevisedProject();

    @PostMapping("objective-cost/rdppRtappApprovalProjectAcknowledgement")
    public @ResponseBody
    ResponseStatusDTO rdppRtappApprovalProjectAcknowledgement(@RequestBody ProjectListDTO projectDTO);

    @GetMapping("tapp-objective-cost/find-by-id/{id}")
    @ResponseBody
    Optional<TappObjectiveCost> findRtappById(@PathVariable Long id);

    @GetMapping("tapp-objective-cost/find-by-project-concept-id/{projectConceptId}")
    @ResponseBody
    Optional<TappObjectiveCost> findRtappByProjectConceptId(@PathVariable Long projectConceptId);

    @GetMapping("tapp-objective-cost/find-by-reference-id/{referenceId}")
    @ResponseBody
    Optional<TappObjectiveCost> findRtappByReferenceId(@PathVariable Long referenceId);

    @GetMapping("tapp-objective-cost/find-by-reference-id-and-agency-id/{referenceId}/{agencyId}")
    @ResponseBody
    Optional<TappObjectiveCost> findRtappByReferenceIdAndAgencyId(@PathVariable Long referenceId, @PathVariable Long agencyId);

    @GetMapping("objective-cost/getProjectInfoByProjectCode/{project_code}/{project_type}")
    @ResponseBody
    EcnecProjectInfoDTO getProjectInfoByProjectCode(@PathVariable String project_code, @PathVariable String project_type);
}
