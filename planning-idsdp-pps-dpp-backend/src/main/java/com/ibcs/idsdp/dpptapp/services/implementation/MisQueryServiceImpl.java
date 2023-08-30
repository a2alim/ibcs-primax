package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.dpptapp.client.ConfigurationClientService;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.client.dto.request.SectorDivisionDTO;
import com.ibcs.idsdp.dpptapp.services.*;
import com.ibcs.idsdp.dpptapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappObjectiveCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dashboardDTO.AnnexureAmountDTO;
import com.ibcs.idsdp.dpptapp.web.dto.misDTO.MisQueryRequest;
import com.ibcs.idsdp.dpptapp.web.dto.misDTO.MisQueryResponse;
import com.ibcs.idsdp.dpptapp.web.dto.misDTO.PcPageableResponse;
import com.ibcs.idsdp.dpptapp.web.dto.pageable.Pageable;
import com.ibcs.idsdp.dpptapp.web.dto.pageable.PageableResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
@Transactional
public class MisQueryServiceImpl implements MisQueryService {

    private final ProjectConceptClientService projectConceptClientService;
    private final DppObjectiveCostService dppObjectiveCostService;
    private final TappObjectiveCostService tappObjectiveCostService;
    private final ProjectMovementService projectMovementService;
    private final ConfigurationClientService configurationClientService;
    private final DashboardService dashboardService;

    @Override
    public PageableResponse applyMisQuery(MisQueryRequest request) {
        PageableResponse result = new PageableResponse();
        List<MisQueryResponse> list = new ArrayList<>();
        PcPageableResponse pcResponse = projectConceptClientService.applyMisQuery(request);
        Map<Long, AnnexureAmountDTO> annexureAmountDTOMap = dashboardService.getGrandTotalByPcIds(pcResponse.getContent().stream().map(ProjectConceptResponse::getId).collect(Collectors.toSet()));

        List<SectorDivisionDTO> selectedDivisionList = configurationClientService.getSectorDivisionByIdSet(new IdSetRequestBodyDTO() {{setIds(pcResponse.getContent().stream().map(pc->pc.getSectorDivisionId()).collect(Collectors.toSet()));}});
        Map<Long, SectorDivisionDTO> sectorDivisionMap = selectedDivisionList.stream().collect(Collectors.toMap(div->div.getId(), div->div));

        for (ProjectConceptResponse pcInfo: pcResponse.getContent()) {
            MisQueryResponse response = new MisQueryResponse();
            response.setProjectConceptId(pcInfo.getId());
            response.setProjectConceptUuid(pcInfo.getUuid());
            response.setCreatedDate(pcInfo.getCreatedDate());
            response.setPpsCode(pcInfo.getPpsCode());
            response.setProjectType(pcInfo.getProjectTypeDTO());
            response.setSectorDivision(sectorDivisionMap.getOrDefault(pcInfo.getSectorDivisionId(), null));
            response.setAnnexureAmount(annexureAmountDTOMap.getOrDefault(pcInfo.getId(), null));

            if (pcInfo.getProjectTypeDTO().getNameEn().equals("DPP")) {
                DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
                setDppInfo(pcInfo, dppInfo, response);
            } else if (pcInfo.getProjectTypeDTO().getNameEn().equals("TAPP")) {
                TappObjectiveCostDTO tappInfo = tappObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
                setTappInfo(pcInfo, tappInfo, response);
            }

            list.add(response);
        }

        populatePageableQueryData(list, pcResponse, result);
        return result;
    }

    private void setDppInfo(ProjectConceptResponse pcInfo, DppObjectiveCostDTO dppInfo, MisQueryResponse response) {
        ProjectMovementStage currentStage = (dppInfo==null)?null:projectMovementService.getCurrentStageInDpp(dppInfo.getId());
        response.setDppTappMasterId(dppInfo==null?0:dppInfo.getId());
        response.setDppTappMasterUuid(dppInfo==null?"":dppInfo.getUuid());
        response.setProjectTitleEn(dppInfo==null?pcInfo.getTitleEn():dppInfo.getProjectTitleEn());
        response.setProjectTitleBn(dppInfo==null?pcInfo.getTitleBn():dppInfo.getProjectTitleBn());
        response.setMinistryDivision(dppInfo==null?pcInfo.getSponsoringMinistryName():dppInfo.getMinistryDivision());
        response.setImplementingAgency(dppInfo==null?pcInfo.getImplementingAgencyName():dppInfo.getImplementingAgency());
        response.setCommencementDate(dppInfo==null?pcInfo.getExpCommencementDate():dppInfo.getDateCommencement());
        response.setCompletionDate(dppInfo==null?pcInfo.getExpCompletionDate():dppInfo.getDateCompletion());
        response.setMovementStatus(currentStage==null?null:currentStage.getCurrentStage().toString().replace('_',' '));
    }

    private void setTappInfo(ProjectConceptResponse pcInfo, TappObjectiveCostDTO tappInfo, MisQueryResponse response) {
        ProjectMovementStage currentStage = (tappInfo==null)?null: projectMovementService.getCurrentStageInDpp(tappInfo.getId());
        response.setDppTappMasterId(tappInfo==null?0:tappInfo.getId());
        response.setDppTappMasterUuid(tappInfo==null?"":tappInfo.getUuid());
        response.setProjectTitleEn(tappInfo==null?pcInfo.getTitleEn():tappInfo.getProjectTitleEn());
        response.setProjectTitleBn(tappInfo==null?pcInfo.getTitleBn():tappInfo.getProjectTitleBn());
        response.setMinistryDivision(tappInfo==null?pcInfo.getSponsoringMinistryName():tappInfo.getMinistryDivision());
        response.setImplementingAgency(tappInfo==null?pcInfo.getImplementingAgencyName():tappInfo.getImplementingAgency());
        response.setCommencementDate(tappInfo==null?pcInfo.getExpCommencementDate():tappInfo.getDateCommencement());
        response.setCompletionDate(tappInfo==null?pcInfo.getExpCompletionDate():tappInfo.getDateCompletion());
        response.setMovementStatus(currentStage==null?null:currentStage.getCurrentStage().toString().replace('_',' '));
    }

    private void populatePageableQueryData(List<MisQueryResponse> list, PcPageableResponse pcResponse, PageableResponse result) {
        Pageable pageable = new Pageable();
        pageable.setPageNumber(pcResponse.getPageable().getPageNumber());
        pageable.setPageSize(pcResponse.getPageable().getPageSize());
        pageable.setOffset(pcResponse.getPageable().getOffset());
        pageable.setPaged(pcResponse.getPageable().isPaged());
        pageable.setUnpaged(pcResponse.getPageable().isUnpaged());

        result.setContent(list);
        result.setPageable(pageable);
        result.setTotalElements(pcResponse.getTotalElements());
        result.setTotalPages(pcResponse.getTotalPages());
        result.setLast(pcResponse.isLast());
        result.setSize(pcResponse.getSize());
        result.setNumber(pcResponse.getNumber());
        result.setNumberOfElements(pcResponse.getNumberOfElements());
        result.setFirst(pcResponse.isFirst());
        result.setEmpty(pcResponse.isEmpty());
    }
}

