package com.ibcs.idsdp.projectconcept.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptMasterDTO;
import com.ibcs.idsdp.projectconcept.web.dto.pageable.PageableResponse;
import com.ibcs.idsdp.projectconcept.web.dto.request.*;
import com.ibcs.idsdp.projectconcept.web.dto.response.ResponseStatusDTO;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;

public interface ProjectConceptMasterService {

    Page<ProjectConceptMasterDTO> getProjectSummaryByProjectType(ProjectSummarySearchRequest request);

    Page<ProjectConceptMasterDTO> getProjectSummaryBySectorDivision(ProjectSummarySearchRequest request);

    Page<ProjectConceptMasterDTO> getProjectSummaryByForeignAid(PageableRequestBodyDTO request);

    Page<ProjectConceptMasterDTO> getProjectSummaryByGoB(PageableRequestBodyDTO request);

    Page<ProjectConceptMasterDTO> criteriaBasedSearch(PsFsListSearchRequest request);

    Page<ProjectConceptMasterDTO> applyFilter(SearchWithPageableRequest request);

    Set<Long> getProjectConceptIdListByAgency(Long agencyId);

    List<ProjectConceptMasterDTO> getNonApprovedDppTapp();

    List<ProjectConceptMasterDTO> getApprovedDppTapp();

    public List<ProjectConceptMasterDTO> getApprovedDppTappForEpims();

    public List<ProjectConceptMasterDTO> getDppTappForSpims();

    ProjectConceptMasterDTO getProjectConceptByPpsCode(String ppsCode);

    ProjectConceptMasterDTO getProjectConceptByPpsId(Long ppsId);

    PageableResponse applyMisQuery(MisQueryRequest query);

    ResponseStatusDTO ecnecApprovalProjectAcknowledgement(ProjectListDTO projectDTO);

    ProjectConceptMasterDTO updateProjectShortInfo(ProjectConceptShortInfoDTO request);

    ProjectConceptMasterDTO updateMovementTimeByPcId(Long pcId);

    ProjectConceptMasterDTO updateAmsIdByPpsId(PpsIdAmsIdDTO request);

    List<ProjectConceptMasterDTO> getProjectByAgency();

    ProjectConceptMasterDTO updateEpimsCodeByPpsCode(PpsCodeEpimsCodeDTO request);

    ProjectConceptMasterDTO savePlisPdfUrl(PlisRequestDTO request);
}
