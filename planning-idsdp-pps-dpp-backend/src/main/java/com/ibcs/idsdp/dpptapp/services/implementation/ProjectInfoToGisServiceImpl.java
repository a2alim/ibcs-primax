package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.dpptapp.client.ConfigurationClientService;
import com.ibcs.idsdp.dpptapp.client.GisClientService;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.client.dto.request.AgencyDTO;
import com.ibcs.idsdp.dpptapp.client.dto.request.MinistryDivisionDTO;
import com.ibcs.idsdp.dpptapp.client.dto.request.SectorDTO;
import com.ibcs.idsdp.dpptapp.client.dto.request.SubSectorDTO;
import com.ibcs.idsdp.dpptapp.model.domain.DppLogFrame;
import com.ibcs.idsdp.dpptapp.model.domain.ProjectDetailsPartB;
import com.ibcs.idsdp.dpptapp.model.repositories.LogFrameRepository;
import com.ibcs.idsdp.dpptapp.services.*;
import com.ibcs.idsdp.dpptapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappObjectiveCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectInfoSendToGisRequestDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectInfoToGisRequestDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.DetailsEstimatedCostResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.DppLocationResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.GrandTotalResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectInfoToGisDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
@Transactional
public class ProjectInfoToGisServiceImpl implements ProjectInfoToGisService {

    private final ProjectConceptClientService projectConceptClientService;
    private final DppObjectiveCostService dppObjectiveCostService;
    private final TappObjectiveCostService tappObjectiveCostService;
    private final ProjectMovementService projectMovementService;
    private final DppAnnualPhasingCostService dppAnnualPhasingCostService;
    private final TappAnnualPhasingCostService tappAnnualPhasingCostService;
    private final ProjectDetailsPartBService projectDetailsPartBService;
    private final ConfigurationClientService configService;
    private final LogFrameRepository logFrameRepository;
    private final DppLocationService dppLocationService;
    private final GisClientService gisClientService;

    @Override
    public ResponseStatus getProjectInfoToGisByIdAndType(ProjectInfoToGisRequestDTO requestDTO) {
        ProjectInfoToGisDTO result = new ProjectInfoToGisDTO();
        if (requestDTO.getProjectType().equalsIgnoreCase("PC")) {
            setPcInfo(requestDTO, result);
        } else if (requestDTO.getProjectType().equalsIgnoreCase("DPP")) {
            setDppInfo(requestDTO, result);
        } else if (requestDTO.getProjectType().equalsIgnoreCase("TAPP")) {
            setTappInfo(requestDTO, result);
        }

        ProjectInfoSendToGisRequestDTO newRequestDTO = populateGisRequest(requestDTO, result);
        System.out.println("GIS Request: "+newRequestDTO);
        ResponseStatus responseStatus = gisClientService.sendProjectData(newRequestDTO);
        return responseStatus;
    }

    private void setPcInfo(ProjectInfoToGisRequestDTO requestDTO, ProjectInfoToGisDTO result) {
        ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptMasterId(requestDTO.getPcUuid());
        ProjectMovementStage currentStage = projectMovementService.getCurrentStageInProjectConcept(pcInfo.getId());
        DppLocationResponse locationInfo = dppLocationService.getByProjectSummaryId(pcInfo.getId());
        AgencyDTO agency = configService.getAgencyByNameEn(pcInfo.getImplementingAgencyName());
        MinistryDivisionDTO ministry = configService.getMinistryByNameEn(pcInfo.getSponsoringMinistryName());
        SectorDTO sector = configService.getBySectorId(pcInfo.getSectorId());
        SubSectorDTO subSector = configService.getBySubSectorId(pcInfo.getSubSectorId());

        result.setProjectId(pcInfo.getId());
        result.setProjectCode(pcInfo.getProjectCode());
        result.setSource("Project Concept");
        result.setProjectName(pcInfo.getTitleEn());
        result.setTotalCost(pcInfo.getTotalAmount().toString());
        result.setStartDate(pcInfo.getExpCommencementDate());
        result.setEndDate(pcInfo.getExpCompletionDate());
        result.setStatus(currentStage.getCurrentStage().toString().replace('_',' '));
        result.setBeneficiary("");
        result.setProjectObjection("");
        result.setAgency(agency==null?"":agency.getNameEn());
        result.setAgencyId(agency==null?null:agency.getId());
        result.setMinistryDivision(ministry==null?"":ministry.getNameEn());
        result.setMinistryDivisionId(ministry==null?null:ministry.getId());
        result.setSector(pcInfo.getSectorId());
        result.setSectorName(sector.getSectorNameEn());
        result.setSectorNameBn(sector.getSectorNameBn());
        result.setSubSector(pcInfo.getSubSectorId());
        result.setSubSectorName(subSector.getSubSectorNameEn());
        result.setSubSectorNameBn(subSector.getSubSectorNameBn());
        result.setLocation(locationInfo);
    }

    private void setDppInfo(ProjectInfoToGisRequestDTO requestDTO, ProjectInfoToGisDTO result) {
        Double totalCost = Double.valueOf(0);
        DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getObjectiveCostByPcUuid(requestDTO.getPcUuid());
        ProjectMovementStage currentStage = dppInfo==null?null:projectMovementService.getCurrentStageInDpp(dppInfo.getId());
        ProjectDetailsPartB projectDetails = projectDetailsPartBService.getProjectDetailsByProjectId(requestDTO.getPcUuid());
        List<GrandTotalResponse> grandTotal = dppInfo==null?null:dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(dppInfo.getProjectConceptMasterId()).getBody();
        DppLocationResponse locationInfo = dppInfo==null?null:dppLocationService.getByProjectSummaryId(dppInfo.getProjectConceptMasterId());
        ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptMasterId(requestDTO.getPcUuid());
        AgencyDTO agency = configService.getAgencyByNameEn(pcInfo.getImplementingAgencyName());
        MinistryDivisionDTO ministry = configService.getMinistryByNameEn(pcInfo.getSponsoringMinistryName());
        SectorDTO sector = configService.getBySectorId(pcInfo.getSectorId());
        SubSectorDTO subSector = configService.getBySubSectorId(pcInfo.getSubSectorId());

        if (grandTotal !=null && grandTotal.size()>0){
            totalCost = grandTotal.get(grandTotal.size()-1).getDppAnnualPhasingCostTotal().get(0).getTotalAmount();
        }

        result.setProjectId(dppInfo==null?null:dppInfo.getId());
        result.setProjectCode(pcInfo.getPpsCode());
        result.setSource("DPP");
        result.setProjectName(dppInfo==null?pcInfo.getTitleEn():dppInfo.getProjectTitleEn());
        result.setTotalCost(totalCost.toString());
        result.setStartDate(dppInfo==null?pcInfo.getExpCommencementDate():dppInfo.getDateCommencement());
        result.setEndDate(dppInfo==null?pcInfo.getExpCompletionDate():dppInfo.getDateCompletion());
        result.setStatus(currentStage==null?"":currentStage.getCurrentStage().toString().replace('_',' '));
        result.setBeneficiary(projectDetails==null?"":projectDetails.getPopulationCoverage());

        result.setProjectObjection("");
        Optional<DppLogFrame> logFrame = logFrameRepository.findAllByProjectConceptUuid(requestDTO.getPcUuid());
        if (logFrame.isPresent()) {
            DppLogFrame dppLogFrame = logFrame.get();
            result.setProjectObjection(dppLogFrame.getObjectiveNS());
        }

        result.setAgency(agency==null?"":agency.getNameEn());
        result.setAgencyId(agency==null?null:agency.getId());
        result.setMinistryDivision(ministry==null?"":ministry.getNameEn());
        result.setMinistryDivisionId(ministry==null?null:ministry.getId());
        result.setSector(pcInfo.getSectorId());
        result.setSectorName(sector.getSectorNameEn());
        result.setSectorNameBn(sector.getSectorNameBn());
        result.setSubSector(pcInfo.getSubSectorId());
        result.setSubSectorName(subSector.getSubSectorNameEn());
        result.setSubSectorNameBn(subSector.getSubSectorNameBn());
        result.setLocation(locationInfo);
    }

    private void setTappInfo(ProjectInfoToGisRequestDTO requestDTO, ProjectInfoToGisDTO result) {
        TappObjectiveCostDTO tappInfo = tappObjectiveCostService.getObjectiveCostByPcUuid(requestDTO.getPcUuid());
        ProjectMovementStage currentStage = tappInfo==null?null:projectMovementService.getCurrentStageInTapp(tappInfo.getId());
        DetailsEstimatedCostResponse grandTotal = tappAnnualPhasingCostService.getDetailsEstimatedCost(requestDTO.getPcUuid());
        ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptMasterId(requestDTO.getPcUuid());
        AgencyDTO agency = configService.getAgencyByNameEn(pcInfo.getImplementingAgencyName());
        MinistryDivisionDTO ministry = configService.getMinistryByNameEn(pcInfo.getSponsoringMinistryName());
        SectorDTO sector = configService.getBySectorId(pcInfo.getSectorId());
        SubSectorDTO subSector = configService.getBySubSectorId(pcInfo.getSubSectorId());

        result.setProjectId(tappInfo==null?null:tappInfo.getId());
        result.setProjectCode(pcInfo.getPpsCode());
        result.setSource("TAPP");
        result.setProjectName(tappInfo==null?pcInfo.getTitleEn():tappInfo.getProjectTitleEn());
        result.setTotalCost(grandTotal.getGrandTotalResponses().getTotalAmount().toString());
        result.setStartDate(tappInfo==null?pcInfo.getExpCommencementDate():tappInfo.getDateCommencement());
        result.setEndDate(tappInfo==null?pcInfo.getExpCompletionDate():tappInfo.getDateCompletion());
        result.setStatus(currentStage==null?"":currentStage.getCurrentStage().toString().replace('_',' '));
        result.setBeneficiary("");
        result.setProjectObjection("");
        result.setAgency(agency==null?"":agency.getNameEn());
        result.setAgencyId(agency==null?null:agency.getId());
        result.setMinistryDivision(ministry==null?"":ministry.getNameEn());
        result.setMinistryDivisionId(ministry==null?null:ministry.getId());
        result.setSector(pcInfo.getSectorId());
        result.setSectorName(sector.getSectorNameEn());
        result.setSectorNameBn(sector.getSectorNameBn());
        result.setSubSector(pcInfo.getSubSectorId());
        result.setSubSectorName(subSector.getSubSectorNameEn());
        result.setSubSectorNameBn(subSector.getSubSectorNameBn());
    }

    private ProjectInfoSendToGisRequestDTO populateGisRequest(ProjectInfoToGisRequestDTO requestDTO, ProjectInfoToGisDTO result) {
        ProjectInfoSendToGisRequestDTO newRequestDTO = new ProjectInfoSendToGisRequestDTO();
        newRequestDTO.setData(result);
        newRequestDTO.setAccess_token(requestDTO.getAccess_token());
        newRequestDTO.setDoptor_token(requestDTO.getDoptor_token());

        return newRequestDTO;
    }
}

