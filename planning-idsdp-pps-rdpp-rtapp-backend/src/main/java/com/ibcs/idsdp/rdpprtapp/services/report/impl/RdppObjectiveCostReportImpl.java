package com.ibcs.idsdp.rdpprtapp.services.report.impl;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.client.ConfigurationClientService;
import com.ibcs.idsdp.rdpprtapp.client.PpsDppTappClientService;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.services.DppAnnualPhasingCostService;
import com.ibcs.idsdp.rdpprtapp.services.DppLocationServiceImp;
import com.ibcs.idsdp.rdpprtapp.services.DppLocationWiseBreakdownServiceImpl;
import com.ibcs.idsdp.rdpprtapp.services.LogFrameServiceImp;
import com.ibcs.idsdp.rdpprtapp.services.implementation.DppAnnualPhasingCostServiceImpl;
import com.ibcs.idsdp.rdpprtapp.services.report.RdppObjectiveCostReport;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.report.FiscalYearResponseDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.report.PartAItemWIseCumulativeDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.report.RdppObjectiveAndCostAllResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.report.DppResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.*;
import lombok.AllArgsConstructor;

import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class RdppObjectiveCostReportImpl implements RdppObjectiveCostReport {

    DppObjectiveCostRepository dppObjectiveCostRepository;
    DppAnnualPhasingCostService dppAnnualPhasingCostService;
    DppLocationWiseBreakdownServiceImpl dppLocationWiseBreakdownService;
    DppAnnualPhasingCostServiceImpl dppAnnualPhasingCostServiceImpl;
    DppLocationServiceImp dppLocationServiceImp;
    PpsDppTappClientService ppsDppTappClientService;
    ConfigurationClientService configurationClientService;
    LogFrameServiceImp logFrameServiceImp;


    @Override
    public RdppObjectiveAndCostAllResponse getProjectSummaryByPcUuidId(String pcUuid) {
        RdppObjectiveAndCostAllResponse all = new RdppObjectiveAndCostAllResponse();
        List<DppObjectiveCost> objList = dppObjectiveCostRepository.findAllByProjectConceptUuidAndIsDeletedOrderByIdAsc(pcUuid, false);
        /** Set Rdpp Object And Cost*/
        List<DppObjectiveCostDTO> list = new ArrayList<>();
        for (DppObjectiveCost costList : objList) {
            DppObjectiveCostDTO dto = new DppObjectiveCostDTO();
            BeanUtils.copyProperties(costList, dto);
            list.add(dto);
        }
        DppObjectiveCostDTO currentRdppObjectCost = list.get(list.size() - 1);
        SectorDivision sector = configurationClientService.getSectorDivisionById(currentRdppObjectCost.getConcernedDivisionId());
        currentRdppObjectCost.setSectorDivision(sector);
        all.setRdppObjectAndCostCurrentVersion(currentRdppObjectCost);

        /** Dpp Object And cost */
        DppResponse dppResponse = ppsDppTappClientService.getDppObjectivesAndCostByPcUuid(objList.get(0).getProjectConceptUuid());
        DppObjectiveCostResponse dppObjective = dppResponse.getRes();
        all.setDppObjectAndCost(dppObjective);

        /** (Estimated Cost of the project calculation) */
        List<DppAnnualPhasingCostTotalDTO> estimatedCost = new ArrayList<>();
        /** Dpp Grand Total or original annual phasing cost  */
        ResponseEntity<List<GrandTotalResponse>> dppGrandTotall = ppsDppTappClientService.getGrandTotalByProjectConceptId(objList.get(0).getProjectConceptMasterId());
        DppAnnualPhasingCostTotalDTO a = grandTotalCal(dppGrandTotall);
        a.setDateCommencement(dppObjective.getDateCommencement());
        a.setDateCompletion(dppObjective.getDateCompletion());
        a.setRevisedVersion("Original");
        estimatedCost.add(a);

        /** Annual Phasing cost Previous revised Data get here */
        for (int i = 0; i < objList.size(); i++) {
            DppObjectiveCost val = objList.get(i);
            if (val.getReferenceId() != null) {
                ResponseEntity<List<GrandTotalResponse>> grandTotal2 = dppAnnualPhasingCostService.getGrandTotalByRdppMasterId(val.getReferenceId());
                DppAnnualPhasingCostTotalDTO dppDto = grandTotalCal(grandTotal2);
                DppObjectiveCost preVal = objList.get(i - 1);
                dppDto.setDateCommencement(preVal.getDateCommencement());
                dppDto.setDateCompletion(preVal.getDateCompletion());
                dppDto.setRevisedVersion(preVal.getRevisedVersion());
                estimatedCost.add(dppDto);
            }
        }

        /** Annual Phasing cost proposed Data set here */
        DppObjectiveCost lastIndex = objList.get(objList.size() - 1);
        ResponseEntity<List<GrandTotalResponse>> grandTotal3 = dppAnnualPhasingCostService.getGrandTotalByRdppMasterId(lastIndex.getId());
        DppAnnualPhasingCostTotalDTO dDto = grandTotalCal(grandTotal3);
        dDto.setDateCommencement(lastIndex.getDateCommencement());
        dDto.setDateCompletion(lastIndex.getDateCompletion());
        dDto.setRevisedVersion(lastIndex.getRevisedVersion());
        estimatedCost.add(dDto);

        /** Revised start Year and End year set for Year wise Estimated cost table */
        List<DppAnnualPhasingCostTotalDTO> estimated = new ArrayList<>();
        for (int i = 0; i < estimatedCost.size(); i++) {
            DppAnnualPhasingCostTotalDTO dto = estimatedCost.get(i);
            if (i == 0) {
                Long startYear = Long.valueOf(dto.getDateCommencement().getYear());
                dto.setRevisedStartYear(startYear);
            }
            if (i > 0) {
                DppAnnualPhasingCostTotalDTO preVal = estimatedCost.get(i - 1);
                Long startYear2 = Long.valueOf(preVal.getDateCompletion().getYear());
                dto.setRevisedStartYear(startYear2);
            }
            Long endYear = Long.valueOf(dto.getDateCompletion().getYear());
            dto.setRevisedEndYear(endYear);
            estimated.add(dto);
        }
        all.setEstimatedCost(estimated);


        /** Fiscal Year Calculate */
        int fiscalStartDate = lastIndex.getDateCommencement().getYear();
        int fiscalEndDate = lastIndex.getDateCompletion().getYear();
        List<FiscalYearResponseDto> fiscalYearRes = new ArrayList<>();

        for (int i = fiscalStartDate; i < fiscalEndDate; i++) {
            FiscalYearResponseDto fsYear = new FiscalYearResponseDto();
            String fiscalYear = i + "-" + (i + 1);
            fsYear.setFiscalYear(fiscalYear);
            fiscalYearRes.add(fsYear);
        }
        all.setFiscalYearList(fiscalYearRes);

        /** Economic Code-wise Comparison of Cost Summary Between the Original DPP and RDPP */
        ResponseEntity<GrandTotalDifferenceResponse> grandTotalDifferenceResponse = dppAnnualPhasingCostServiceImpl.getGrandTotalByMasterId(lastIndex.getId());
        all.setEconomicCodeWise(grandTotalDifferenceResponse.getBody());


        /** Project Location */
        LocationAndCostResponse rdppLocation = dppLocationServiceImp.getLocationByObjectiveCostIdUsingProjectSummary(objList.get(objList.size() - 1).getId());
        all.setRdppLocation(rdppLocation);
        LocationAndCostResponse dppLocation = ppsDppTappClientService.getDppLocationByProjectConceptId(objList.get(0).getProjectConceptMasterId());
        all.setDppLocation(dppLocation);

        /** Item Wise cumulative */
        PartAItemWIseCumulativeDto partA = new PartAItemWIseCumulativeDto();
        DppAnnualPhasingCostWithChildResponse rev = itemWiseCml(objList.get(objList.size() - 1).getId(), "Revenue_Component");
        partA.setRevItemWiseCum(rev);
        DppAnnualPhasingCostWithChildResponse cap = itemWiseCml(objList.get(objList.size() - 1).getId(), "Capital_Component");
        partA.setCapItemWiseCum(cap);
        ResponseEntity<List<GrandTotalResponse>> gdTotal = dppAnnualPhasingCostServiceImpl.getGrandTotalByRdppMasterId(lastIndex.getId());
        List<GrandTotalResponse> grandTotalResponse = gdTotal.getBody();
        partA.setGrandTotal(grandTotalResponse);
        /** If List size 0 it will return dpp grand total not rdpp
         We need rdpp grand total when proposed for revised  */
        /*if (estimated.size() > 0) {
            partA.setGrandTotal(estimated.get(estimated.size()-1));
        }*/
        DppAnnualPhasingCostWithChildResponse contingency = itemWiseCml(objList.get(objList.size()-1).getId(), "Contingency");
        partA.setContingency(contingency);
        all.setPartAItemWIseCumulative(partA);

        /** Log Frame*/
        all.setLogFrame(logFrameServiceImp.getLogFrameById(lastIndex.getId()));

        return all;
    }


    /** Item wise Cumulative data get here */
    private DppAnnualPhasingCostWithChildResponse itemWiseCml(Long id, String componentName) {
        ProjectConceptIdAndComponentNameRequest request = new ProjectConceptIdAndComponentNameRequest();
        request.setRdppMasterId(id);
        request.setComponentName(componentName);
        return dppAnnualPhasingCostServiceImpl.getByProjectConceptIdAndComponentName(request).getBody();
    }

    /** PA Amount Calculation here */
    private double paAmountCal(DppAnnualPhasingCostTotalDTO item) {
        double paAmount = 0;
        paAmount = item.getSpAcAmount() + item.getGobThruAmount() + item.getThruDpAmount() + item.getThruPdAmount();
        return paAmount;
    }

    /** Grand Total Amount Calculation here */
    private DppAnnualPhasingCostTotalDTO grandTotalCal(ResponseEntity<List<GrandTotalResponse>> grandTotal) {
        DppAnnualPhasingCostTotalDTO annualCost = new DppAnnualPhasingCostTotalDTO();
        for (GrandTotalResponse grandTotalResponse : grandTotal.getBody()) {
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                DppAnnualPhasingCostTotalDTO annualCostCopy = grandTotalResponse.getDppAnnualPhasingCostTotal().get(0);
                BeanUtils.copyProperties(annualCostCopy, annualCost);
                annualCost.setPaAmount(paAmountCal(annualCost));
            }
        }
        return annualCost;
    }

}
