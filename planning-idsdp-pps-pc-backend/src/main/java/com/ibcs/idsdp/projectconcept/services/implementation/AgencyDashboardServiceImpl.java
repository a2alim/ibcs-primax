package com.ibcs.idsdp.projectconcept.services.implementation;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.projectconcept.client.ConfigurationClientService;
import com.ibcs.idsdp.projectconcept.client.DppClientService;
import com.ibcs.idsdp.projectconcept.client.FSClientService;
import com.ibcs.idsdp.projectconcept.client.RdppRtappClientService;
import com.ibcs.idsdp.projectconcept.client.dto.AgencyDTO;
import com.ibcs.idsdp.projectconcept.client.dto.FsSummaryDTO;
import com.ibcs.idsdp.projectconcept.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.projectconcept.client.dto.response.UserGroupResponse;
import com.ibcs.idsdp.projectconcept.enums.SourceEnum;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptMaster;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptSummaryRepository;
import com.ibcs.idsdp.projectconcept.services.IAgencyDashboardService;
import com.ibcs.idsdp.projectconcept.services.ProjectConceptMasterService;
import com.ibcs.idsdp.projectconcept.web.dto.AgencyDashboardDTO;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptMasterDTO;
import com.ibcs.idsdp.projectconcept.web.dto.location.DivisionCountDTO;
import com.ibcs.idsdp.projectconcept.web.dto.location.LocationAndCostResponse;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectTypeDTO;
import com.ibcs.idsdp.projectconcept.web.dto.location.LocationCountDTO;
import com.ibcs.idsdp.projectconcept.web.dto.request.PsFsListSearchRequest;
import com.ibcs.idsdp.projectconcept.web.dto.response.ApprovalAndNotApprovalProjectListResponseDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AgencyDashboardServiceImpl implements IAgencyDashboardService {

    private final ConfigurationClientService configurationClientService;
    private final ProjectConceptMasterRepository projectConceptMasterRepository;
    private final ProjectConceptSummaryRepository projectConceptSummaryRepository;
    private final DppClientService dppClientService;
    private final RdppRtappClientService rdppClientService;
    private final FSClientService fsClientService;
    private final ProjectConceptMasterService pcMasterService;

    @Override
    public AgencyDashboardDTO getAgencyDashboardData() {
        AgencyDashboardDTO agencyDashboardDTO = new AgencyDashboardDTO();
        UserGroupResponse userGroup = getUserGroup();
        if (userGroup != null) {
            List<ProjectConceptMaster> projectConceptMasters = getPcMasterData(userGroup);

            if (!projectConceptMasters.isEmpty()) {

                Set<Long> pcIds = projectConceptMasters.stream().map(ProjectConceptMaster::getId).collect(Collectors.toSet());

                Set<Long> projectTypeIds = projectConceptMasters.stream().map(ProjectConceptMaster::getProjectTypeId).collect(Collectors.toSet());
                Map<Long, ProjectTypeDTO> projectTypeDTOList = configurationClientService.getProjectTypeByIdSet(new IdSetRequestBodyDTO() {{
                    setIds(projectTypeIds);
                }}).stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, projectTypeDTO -> projectTypeDTO));
                agencyDashboardDTO = dppClientService.getAllStagesByPcIds(new AgencyDashboardDTO() {{
                    setIds(pcIds);
                }});

                List<ProjectConceptMaster> pecProjectList = agencyDashboardDTO.getPecProjectIds().stream()
                        .map(id -> projectConceptMasterRepository.findByIdAndIsDeleted(id, false))
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toList());
                List<ProjectConceptMaster> pscProjectList = agencyDashboardDTO.getPscProjectIds().stream()
                        .map(id -> projectConceptMasterRepository.findByIdAndIsDeleted(id, false))
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toList());
                List<ProjectConceptMaster> atPCProjectList = agencyDashboardDTO.getAtPCProjectIds().stream()
                        .map(id -> projectConceptMasterRepository.findByIdAndIsDeleted(id, false))
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toList());
                List<ProjectConceptMaster> preparedProjectList = agencyDashboardDTO.getPreparedIds().stream()
                        .map(id -> projectConceptMasterRepository.findByIdAndIsDeleted(id, false))
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toList());
                List<ProjectConceptMaster> notPreparedProjectList = agencyDashboardDTO.getNotPreparedIds().stream()
                        .map(id -> projectConceptMasterRepository.findByIdAndIsDeleted(id, false))
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toList());

                pecProjectList.forEach(m -> m.setProjectTypeDTO(configurationClientService.getProjectTypeById(m.getProjectTypeId())));
                pscProjectList.forEach(m -> m.setProjectTypeDTO(configurationClientService.getProjectTypeById(m.getProjectTypeId())));
                atPCProjectList.forEach(m -> m.setProjectTypeDTO(configurationClientService.getProjectTypeById(m.getProjectTypeId())));
                preparedProjectList.forEach(m -> m.setProjectTypeDTO(configurationClientService.getProjectTypeById(m.getProjectTypeId())));
                notPreparedProjectList.forEach(m -> m.setProjectTypeDTO(configurationClientService.getProjectTypeById(m.getProjectTypeId())));

                agencyDashboardDTO.setPecProjectList(pecProjectList);
                agencyDashboardDTO.setPscProjectList(pscProjectList);
                agencyDashboardDTO.setAtPCProjectList(atPCProjectList);
                agencyDashboardDTO.setPreparedProjectList(preparedProjectList);
                agencyDashboardDTO.setNotPreparedProjectList(notPreparedProjectList);

                agencyDashboardDTO.setTotalProjects((pcIds.size()));
                int dpp = 0, tapp = 0;
                for (ProjectConceptMaster master : projectConceptMasters) {
                    if (projectTypeDTOList.get(master.getProjectTypeId()).getNameEn().equalsIgnoreCase("dpp")) {
                        dpp++;
                    } else if (projectTypeDTOList.get(master.getProjectTypeId()).getNameEn().equalsIgnoreCase("tapp")) {
                        tapp++;
                    }
                }
                agencyDashboardDTO.setDpp(dpp);
                agencyDashboardDTO.setTapp(tapp);

                // rdpp and rtapp
                ApprovalAndNotApprovalProjectListResponseDTO responseDTO = rdppClientService.getApprovedNotApprovedRdppRtapp();

                agencyDashboardDTO.setRdppApprovedProjectList(responseDTO.getRdppApprovedList());
                agencyDashboardDTO.setRdppNotApprovedProjectList(responseDTO.getRdppNotApprovedList());
                agencyDashboardDTO.setRtappApprovedProjectList(responseDTO.getRtappApprovedList());
                agencyDashboardDTO.setRtappNotApprovedProjectList(responseDTO.getRtappNotApprovedList());

                // fs set
                List<ProjectConceptMasterDTO> fsCompleteList = new ArrayList<>();
                List<ProjectConceptMasterDTO> fsNotCompleteList = new ArrayList<>();

                PsFsListSearchRequest request = new PsFsListSearchRequest();
                setSearchDto(request);
                Page<ProjectConceptMasterDTO> fsList =  pcMasterService.criteriaBasedSearch(request);

                for (ProjectConceptMasterDTO pc : fsList.getContent()) {
                    FsSummaryDTO fs = fsClientService.getFsSummaryByPCId(pc.getId());
                    if (fs != null) {
                        if (fs.getDppMasterId() == null) {
                            fsNotCompleteList.add(pc);
                        } else {
                            fsCompleteList.add(pc);
                        }
                    }
                }
                agencyDashboardDTO.setFsCompleteProjectList(fsCompleteList);
                agencyDashboardDTO.setFsNotCompleteProjectList(fsNotCompleteList);
                agencyDashboardDTO.setFsComplete(fsCompleteList.size());
                agencyDashboardDTO.setFsNotComplete(fsNotCompleteList.size());
                agencyDashboardDTO.setTotalFs(fsList.getContent().size());


//                List<FsSummaryDTO> fsSummaryList = fsClientService.getFsSummaryList();
//                if (!fsSummaryList.isEmpty()) {
//                    agencyDashboardDTO.setFsComplete((int) fsSummaryList.stream().filter(e -> e.getDppMasterId() != null).count());
//                    agencyDashboardDTO.setFsNotComplete((int) fsSummaryList.stream().filter(e -> e.getDppMasterId() == null).count());
//                    agencyDashboardDTO.setTotalFs(fsSummaryList.size());
//
//                    for (FsSummaryDTO fs : fsSummaryList) {
//                        if (fs.getDppMasterId() != null) {
//                            Optional<ProjectConceptMaster> master = projectConceptMasterRepository.findByIdAndIsDeleted(fs.getProjectConceptMasterId(), false);
//                            ProjectConceptMaster m = master.get();
//                            m.setProjectTypeDTO(configurationClientService.getProjectTypeById(m.getProjectTypeId()));
//                            fsCompleteList.add(m);
//                        } else {
//                            Optional<ProjectConceptMaster> master = projectConceptMasterRepository.findByIdAndIsDeleted(fs.getProjectConceptMasterId(), false);
//                            ProjectConceptMaster m = master.get();
//                            m.setProjectTypeDTO(configurationClientService.getProjectTypeById(m.getProjectTypeId()));
//                            fsNotCompleteList.add(m);
//                        }
//                    }
//
//                }
            }
        }
        return agencyDashboardDTO;
    }

    public void setSearchDto(PsFsListSearchRequest request) {
        request.setProjectType(null);
        request.setSectorDivision(null);
        request.setGob(false);
        request.setIsForeignAid(false);
        request.setIsFsRequired(true);
        request.setProjectName(null);
        request.setSector(null);
        request.setLowAmount(null);
        request.setHighAmount(null);
        request.setStatus(null);
        request.setSource(SourceEnum.FS_PROPOSAL);
        PageableRequestBodyDTO page = new PageableRequestBodyDTO();
        page.setPage(0);
        page.setSize(1000000);
        request.setPageableRequestBodyDTO(page);
    }

    private List<ProjectConceptMaster> getPcMasterData(UserGroupResponse userGroup) {
        List<ProjectConceptMaster> projectConceptMasters = new ArrayList<>();
        if (userGroup.getAgency() != null) {
            projectConceptMasters = projectConceptMasterRepository.findByAgencyIdAndSourceModuleType(userGroup.getAgency().getId(), "DPP_TAPP");
        } else if (userGroup.getMinistryDivision() != null) {
            List<AgencyDTO> agency = configurationClientService.getByMinistryDivisionId(userGroup.getMinistryDivision().getId()).getBody();
            if (!agency.isEmpty()) {
                Set<Long> ids = agency.stream().map(UuidIdHolderRequestBodyDTO::getId).collect(Collectors.toSet());
                projectConceptMasters = projectConceptMasterRepository.findByAgencyIdInAndSourceModuleType(ids, "DPP_TAPP");
            }
        } else if (userGroup.getSectorDivision() != null) {
            projectConceptMasters = projectConceptMasterRepository.findBySectorDivisionIdAndSourceModuleType(userGroup.getSectorDivision().getId(), "DPP_TAPP");
        }
        return projectConceptMasters;
    }

    @Override
    public LocationCountDTO getDashboardLocationData() {
        int dhaka = 0, barisal = 0, chattogram = 0, khulna = 0, mymensingh = 0, rajshahi = 0, rangpur = 0, sylhet = 0;
        LocationCountDTO locationDTO = new LocationCountDTO();
        DivisionCountDTO divisionDTO = new DivisionCountDTO();
        UserGroupResponse userGroup = getUserGroup();
        if (userGroup != null) {
            List<ProjectConceptMaster> projectConceptMasters = getPcMasterData(userGroup);
            if (!projectConceptMasters.isEmpty()) {
                ProjectTypeDTO projectTypeDPP = configurationClientService.getProjectTypeByNameEn("DPP");
                for (ProjectConceptMaster pc : projectConceptMasters) {
                    if (pc.getProjectTypeId() == projectTypeDPP.getId()) {
                        LocationAndCostResponse locationData = dppClientService.getLocationByPcId(pc.getId());
                        if (locationData != null) {
                            for (DivisionRequest division:locationData.getDivisions()) {
                                if (division.getNameEn().equals("DHAKA DIVISION")) {
                                    dhaka++;
                                } else if (division.getNameEn().equals("BARISAL DIVISION")) {
                                    barisal++;
                                } else if (division.getNameEn().equals("CHATTOGRAM DIVISION")) {
                                    chattogram++;
                                } else if (division.getNameEn().equals("KHULNA DIVISION")) {
                                    khulna++;
                                } else if (division.getNameEn().equals("MYMENSINGH DIVISION")) {
                                    mymensingh++;
                                } else if (division.getNameEn().equals("RAJSHAHI DIVISION")) {
                                    rajshahi++;
                                } else if (division.getNameEn().equals("RANGPUR DIVISION")) {
                                    rangpur++;
                                } else if (division.getNameEn().equals("SYLHET DIVISION")) {
                                    sylhet++;
                                }
                            }
                        }
                    }
                }
            }
        }

        divisionDTO.setDhaka(dhaka);
        divisionDTO.setBarisal(barisal);
        divisionDTO.setChattogram(chattogram);
        divisionDTO.setKhulna(khulna);
        divisionDTO.setMymensingh(mymensingh);
        divisionDTO.setRajshahi(rajshahi);
        divisionDTO.setRangpur(rangpur);
        divisionDTO.setSylhet(sylhet);
        locationDTO.setDivision(divisionDTO);

        return locationDTO;
    }

    private UserGroupResponse getUserGroup() {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());
        return configurationClientService.getUserGroupByUserId(id);
    }

}
