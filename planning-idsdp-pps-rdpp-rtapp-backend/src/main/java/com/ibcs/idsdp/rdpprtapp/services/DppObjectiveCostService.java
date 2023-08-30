package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.CommonDppTappSearch;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
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
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

public interface DppObjectiveCostService {

    DppObjectiveCostDTO createObjectiveCost(DppObjectiveCostDTO dppObjectiveCostDTO);

    DppObjectiveCostDTO updateObjectiveCost(DppObjectiveCostDTO dppObjectiveCostDTO);

    DppObjectiveCost getObjectiveCostByPcuuid(String pcuuid);

    ResponseWithResults getObjectivesAndCost(String pcUuid);

    ResponseWithResults getObjectivesAndCostByPcUuidAndId(String pcUuid, Long id);

    ResponseEntity<ResponseStatus> deleteDevPartnerRow(String rowUuid);


    List<DppObjectiveCostDTO> getObjectiveCostList();

    DppObjectiveCostDTO getObjectiveCostByPcUuid(String pcUuid);

    DppObjectiveCostDTO getObjectiveCostByRdppMasterId(Long rdppMasterId);

    AgencyDashboardDTO getAllStagesByPcIds(List<Long> ids);

    ResponseStatus linkFsReportWithDpp(FsLinkWithDto fsLinkWithDto);

    Page<DppObjectiveCostDTO> getRdppTappList(PageableRequestBodyDTO pageableRequestBodyDTO);

    RevisedVersionDTO checkCurrentRdppVersion(String pcUuid);

    String checkCurrentProjectVersion(Long id);

    String getCumulativeDate(Long id, String pcUuid);

    Optional<DppObjectiveCost> findById(Long id);

    Optional<DppObjectiveCost> findByReferenceId(Long referenceId);

    Optional<DppObjectiveCost> findByReferenceIdAndAgencyId(Long referenceId, Long agencyId);

    Optional<DppObjectiveCost> findByProjectConceptId(Long projectConceptId);

    DppObjectiveCostDTO getObjectiveCostByReferenceUuid(String referenceUuid);

    ResponseWithResults getObjectiveCostByUuid(String uuid);

    List<DppAnnualPhasingCostTotalDTO> getEstimatedCost(String pcUuid);

    Page<CommonDppTappSearch> searchRdppRtapp(SearchRequestDTO request);

    List<ProjectListResponseDTO> getApprovedRdppRtapp();
    ApprovalAndNotApprovalProjectListResponseDTO getApprovedNotApprovedRdppRtapp();

    ResponseStatusDTO ecnecApprovalProjectAcknowledgement(ProjectListDTO projectDTO);

    EcnecProjectInfoDTO getProjectInfoByProjectCode(String projectCode, String projectType);
}
