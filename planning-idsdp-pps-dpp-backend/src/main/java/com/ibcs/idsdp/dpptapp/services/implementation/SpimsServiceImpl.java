package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.dpptapp.client.ConfigurationClientService;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.client.dto.request.*;
import com.ibcs.idsdp.dpptapp.model.domain.*;
import com.ibcs.idsdp.dpptapp.model.repositories.FinancialAnalysisRepository;
import com.ibcs.idsdp.dpptapp.services.*;
import com.ibcs.idsdp.dpptapp.services.implementation.annexIII_aGoods.AnnexureGoodServiceImp;
import com.ibcs.idsdp.dpptapp.services.implementation.tappAnnexurs.TappAnnexureGoodServiceImp;
import com.ibcs.idsdp.dpptapp.web.dto.*;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.ProcurementPlanDetails;
import com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs.TappAnnexureGoodsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.jsoup.Jsoup;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DecimalFormat;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
@Transactional
public class SpimsServiceImpl implements SpimsService {

    private final DppObjectiveCostService dppObjectiveCostService;
    private final TappObjectiveCostService tappObjectiveCostService;
    private final ProjectConceptClientService projectConceptClientService;
    private final ProjectMovementService projectMovementService;
    private final ConfigurationClientService configClientService;
    private final DppTappGoService dppTappGoService;
    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final DppAnnualPhasingCostService dppAnnualPhasingCostService;
    private final TappAnnualPhasingCostService tappAnnualPhasingCostService;
    private final AnnexureGoodServiceImp annexureGoodServiceImp;
    private final TappAnnexureGoodServiceImp tappAnnexureGoodServiceImp;
    private final DppLocationWiseBreakdownServiceImpl dppLocationWiseBreakdownService;
    private final ProjectDetailsPartBServiceImpl projectDetailsPartBService;
    private final EffectImpactServiceImpl effectImpactService;
    private final DppOtherDetailsServiceImpl dppOtherDetailsService;
    private final ConfigurationClientService configurationClientService;

    @Override
    public List<ProjectListResponseDTO> getMinistryDppTapp() {
        List<ProjectListResponseDTO> result = new ArrayList<>();
        List<ProjectConceptResponse> list = projectConceptClientService.getDppTappForSpims();
        for (ProjectConceptResponse pcInfo : list) {
            ProjectListResponseDTO dto = new ProjectListResponseDTO();
            dto.setPpsCode(pcInfo.getPpsCode());
            dto.setProjectName(pcInfo.getTitleEn());
            dto.setProjectType(pcInfo.getProjectTypeDTO().getNameEn());
            result.add(dto);
        }

        return result;
    }

    @Override
    public SpimsProjectDetailInfoResultDTO getFullInfoByProjectCode(String projectCode) {
        SpimsProjectDetailInfoResultDTO result = new SpimsProjectDetailInfoResultDTO();
        ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptByPpsCode(projectCode);
        if (pcInfo != null) {
            if (pcInfo.getProjectTypeDTO().getNameEn().equals("DPP")) {
                setDppDetailInfo(pcInfo, result);
            } else if (pcInfo.getProjectTypeDTO().getNameEn().equals("TAPP")) {
                setTappDetailInfo(pcInfo, result);
            }
        } else {
            result.setStatus("fail");
            result.setMessage("Project Not Found!");
            result.setData(new SpimsApprovedProjectDetailInfoDTO());
            return result;
        }
        return result;
    }

    private void setDppDetailInfo(ProjectConceptResponse pcInfo, SpimsProjectDetailInfoResultDTO result) {
        ProjectMovementStage currentStage = null;
        List<ModeOfFinanceDTO> financeList = configurationClientService.getActiveModeFinance().getBody();
        DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        if (dppInfo!=null) currentStage = projectMovementService.getCurrentStageInDpp(dppInfo.getId());
        AgencyDTO agencyDTO = configClientService.getAgencyById(pcInfo.getAgencyId());
        DppTappGo dppGO = dppTappGoService.findByPcUuidAndOrderType(pcInfo.getUuid(), "GO");
        SectorDivisionDTO sectorDivision = dppInfo==null?null:configClientService.getBySectorDivisionId(pcInfo.getSectorDivisionId());
        SectorDTO sector = configClientService.getBySectorId(pcInfo.getSectorId());
        SubSectorDTO subSector = configClientService.getBySubSectorId(pcInfo.getSubSectorId());
        ResponseEntity<List<GrandTotalResponse>> grandTotalList = dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcInfo.getId());
        DetailsEstimatedCostResponse itemWiseEstimatedCost = dppAnnualPhasingCostService.getDetailsEstimatedCost(pcInfo.getUuid());
        ProjectDetailsPartB projectDetails = projectDetailsPartBService.getProjectDetailsByProjectId(pcInfo.getUuid());
        EffectImpact effectImpact = effectImpactService.getEffectImpact(pcInfo.getUuid());
        DppOtherDetails otherDetails = dppOtherDetailsService.getOtherDetailsByProjectId(pcInfo.getUuid());

        SpimsApprovedProjectDetailInfoDTO data = new SpimsApprovedProjectDetailInfoDTO();
        data.setPpsCode(pcInfo.getPpsCode());
        data.setProjectName(dppInfo==null?pcInfo.getTitleEn():dppInfo.getProjectTitleEn());
        data.setProjectNameBn(dppInfo==null?pcInfo.getTitleBn():dppInfo.getProjectTitleBn());
        data.setMinistryCode(agencyDTO==null?"":agencyDTO.getMinistryDivisionDTO().getCode());
        data.setAgencyCode(agencyDTO==null?"":agencyDTO.getCode());
        data.setAdpSectorCode(sector.getCode());
        data.setAdpSubSectorCode(subSector.getCode());

        data.setPovertySituation(projectDetails == null ? "" : Jsoup.parse(projectDetails.getPovertySituation()).text());
        data.setEnvironmentalSustainability(effectImpact == null ? "" : Jsoup.parse(effectImpact.getEnvSustainabilityLand()).text());
        data.setDisasterManagement(effectImpact == null ? "" : Jsoup.parse(effectImpact.getFutureDisasterManagement()).text());
        data.setWomenDevelopmentImpact(effectImpact == null ? "" : Jsoup.parse(effectImpact.getGenderDisabilityGroups()).text());
        data.setEnvironmentalImpactWiseCategory(effectImpact == null ? "" : Jsoup.parse(effectImpact.getEnvironmentalProjectCategory()==null?"":effectImpact.getEnvironmentalProjectCategory()).text());
        data.setSpecificLinkage(otherDetails == null ? "" : Jsoup.parse(otherDetails.getSpecificationLinkagePerspective()).text());
        data.setLandRequired("");

//        setApprovalInfo2(data, currentStage);
//        data.setAdminGoDate(dppGO!=null?dppGO.getRecordDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate():null);
        data.setDateOfCommencement(dppInfo==null?pcInfo.getExpCommencementDate():dppInfo.getDateCommencement());
        data.setDateOfCompletion(dppInfo==null?pcInfo.getExpCompletionDate():dppInfo.getDateCompletion());
        data.setProjectType(pcInfo.getProjectTypeDTO().getNameEn());

        data.setProjectObjectives(Jsoup.parse(dppInfo.getObjectivesTargets()).text());
        for (GrandTotalResponse grandTotalResponse : grandTotalList.getBody()) {
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Revenue_Component")) {
                data.setRevenue(convertDppAnnualPhasingCost(grandTotalResponse.getDppAnnualPhasingCostTotal().get(0)));
            }
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Capital_Component")) {
                data.setCapital(convertDppAnnualPhasingCost(grandTotalResponse.getDppAnnualPhasingCostTotal().get(0)));
            }
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Contingency")) {
                data.setPhysicalContingency(convertDppAnnualPhasingCost(grandTotalResponse.getDppAnnualPhasingCostTotal().get(0)));
                data.setPriceContingency(convertDppAnnualPhasingCost(grandTotalResponse.getDppAnnualPhasingCostTotal().get(1)));
                List<ShortAnnualCostTotalWithFiscalYear> contingency = setYearWiseCost(grandTotalResponse.getGrandTotal());
            }
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                data.setYearWiseEstimatedCost(convertDppCost(grandTotalResponse.getGrandTotal()));
            }
        }

        data.setComponentWiseCost(setComponentWiseCost(itemWiseEstimatedCost));
        data.setYearWiseComponentWiseCost(setYearWiseComponentWiseCost(pcInfo.getId()));

        Optional<FinancialAnalysis> financialAnalysisOptional = financialAnalysisRepository.findByProjectConceptUuid(pcInfo.getUuid());
        if (financialAnalysisOptional.isPresent()) {
            FinancialAnalysis financialAnalysis = financialAnalysisOptional.get();
            ShortFinancialAnalysisDTO financialAnalysisDTO = new ShortFinancialAnalysisDTO();
            financialAnalysisDTO.setEconomicBcr(financialAnalysis.getEconomicBcr());
            financialAnalysisDTO.setFinancialBcr(financialAnalysis.getFinancialBcr());
            financialAnalysisDTO.setEconomicNpv(financialAnalysis.getEconomicNpv());
            financialAnalysisDTO.setFinancialNpv(financialAnalysis.getFinancialNpv());
            financialAnalysisDTO.setEconomicIrr(financialAnalysis.getEconomicIrr());
            financialAnalysisDTO.setFinancialIrr(financialAnalysis.getFiancialIrr());
            data.setFinancialAnalysis(financialAnalysisDTO);
        }

        data.setModeOfFinance(convertModeOfFinance(financeList, dppInfo.getModeFinanceList(), dppInfo.getDevelopmentPartnersList()));
        AnnexureGoodsRequest goods = annexureGoodServiceImp.getDataByTypeAndPcId("Goods", pcInfo.getUuid());
        data.setProcurementPlanGoods(goods==null ? new ArrayList<>() : convertProcurementPlan(goods.getList(), "Goods"));
        AnnexureGoodsRequest works = annexureGoodServiceImp.getDataByTypeAndPcId("Works", pcInfo.getUuid());
        data.setProcurementPlanWorks(works==null ? new ArrayList<>() : convertProcurementPlan(works.getList(), "Works"));
        AnnexureGoodsRequest service = annexureGoodServiceImp.getDataByTypeAndPcId("Service", pcInfo.getUuid());
        data.setProcurementPlanService(service==null ? new ArrayList<>() : convertProcurementPlan(service.getList(), "Service"));
        data.setLocationWiseCost(convertLocationWiseCost(dppLocationWiseBreakdownService.getByProjectConceptMasterId(pcInfo.getId()).getBody()));

        result.setStatus("success");
        result.setMessage("Project Found!");
        result.setData(data);
    }

    private void setTappDetailInfo(ProjectConceptResponse pcInfo, SpimsProjectDetailInfoResultDTO result) {
        ProjectMovementStage currentStage = null;
        List<ModeOfFinanceDTO> financeList = configurationClientService.getActiveModeFinance().getBody();
        TappObjectiveCostDTO tappInfo = tappObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        if (tappInfo!=null) currentStage = projectMovementService.getCurrentStageInTapp(tappInfo.getId());
        AgencyDTO agencyDTO = configClientService.getAgencyById(pcInfo.getAgencyId());
        DppTappGo tappGO = dppTappGoService.findByPcUuidAndOrderType(pcInfo.getUuid(), "GO");
        SectorDTO sector = configClientService.getBySectorId(pcInfo.getSectorId());
        SubSectorDTO subSector = configClientService.getBySubSectorId(pcInfo.getSubSectorId());
        ResponseEntity<List<GrandTotalResponseTapp>> grandTotalList = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcInfo.getId());
        DetailsEstimatedCostResponse itemWiseEstimatedCost = tappAnnualPhasingCostService.getDetailsEstimatedCost(pcInfo.getUuid());

        SpimsApprovedProjectDetailInfoDTO data = new SpimsApprovedProjectDetailInfoDTO();
        data.setPpsCode(pcInfo.getPpsCode());
        data.setProjectName(tappInfo==null?pcInfo.getTitleEn():tappInfo.getProjectTitleEn());
        data.setProjectNameBn(tappInfo==null?pcInfo.getTitleBn():tappInfo.getProjectTitleEn());
        data.setMinistryCode(agencyDTO==null?"":agencyDTO.getMinistryDivisionDTO().getCode());
        data.setAgencyCode(agencyDTO==null?"":agencyDTO.getCode());
        data.setAdpSectorCode(sector.getCode());
        data.setAdpSubSectorCode(subSector.getCode());

//        setApprovalInfo2(data, currentStage);
//        data.setAdminGoDate(tappGO!=null?tappGO.getRecordDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate():null);
        data.setDateOfCommencement(pcInfo==null?pcInfo.getExpCommencementDate():tappInfo.getDateCommencement());
        data.setDateOfCompletion(pcInfo==null?pcInfo.getExpCompletionDate():tappInfo.getDateCompletion());
        data.setProjectType(pcInfo.getProjectTypeDTO().getNameEn());

        for (GrandTotalResponseTapp grandTotalResponse : grandTotalList.getBody()) {
            if (grandTotalResponse.getComponentName().toString().equals("Revenue_Component")) {
                TappAnnualPhasingCostTotalDTO tappRevenue = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                data.setRevenue(convertTappAnnualPhasingCost(tappRevenue));
            }
            if (grandTotalResponse.getComponentName().toString().equals("Capital_Component")) {
                TappAnnualPhasingCostTotalDTO tappCapital = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                data.setCapital(convertTappAnnualPhasingCost(tappCapital));
            }
            if (grandTotalResponse.getComponentName().toString().equals("Contingency")) {
                TappAnnualPhasingCostTotalDTO tappPhysicalContingency = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                TappAnnualPhasingCostTotalDTO tappPriceContingency = grandTotalResponse.getTappAnnualPhasingCostTotal().get(1);
                data.setPhysicalContingency(convertTappAnnualPhasingCost(tappPhysicalContingency));
                data.setPriceContingency(convertTappAnnualPhasingCost(tappPriceContingency));
                List<ShortAnnualCostTotalWithFiscalYear> contingency = setYearWiseCostForTapp(grandTotalResponse.getGrandTotal());
            }

            if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {
                data.setYearWiseEstimatedCost(convertTappCost(grandTotalResponse.getGrandTotal()));
            }
        }

        data.setComponentWiseCost(setComponentWiseCost(itemWiseEstimatedCost));
        data.setModeOfFinance(convertTappModeOfFinance(financeList, tappInfo.getModeFinanceList(), tappInfo.getDevPartnerlist()));
        TappAnnexureGoodsRequest tappGoods = tappAnnexureGoodServiceImp.getDataByTypeAndPcId("Tapp-Goods", pcInfo.getUuid(), false);
        data.setProcurementPlanGoods(tappGoods==null ? new ArrayList<>() : convertTappProcurementPlan(tappGoods.getList(), "Tapp-Goods"));
        TappAnnexureGoodsRequest tappService = tappAnnexureGoodServiceImp.getDataByTypeAndPcId("Tapp-Service", pcInfo.getUuid(), false);
        data.setProcurementPlanService(tappService==null ? new ArrayList<>() : convertTappProcurementPlan(tappService.getList(), "Tapp-Service"));

        result.setStatus("success");
        result.setMessage("Project Found!");
        result.setData(data);
    }

    private AnnualPhasingCostTotalDTO convertDppAnnualPhasingCost(DppAnnualPhasingCostTotalDTO annualPhasingCost) {
        final DecimalFormat format = new DecimalFormat("0.00");
        AnnualPhasingCostTotalDTO dto = new AnnualPhasingCostTotalDTO();
        dto.setTotal(Double.valueOf(format.format(annualPhasingCost.getTotalAmount())));
        dto.setGob(Double.valueOf(format.format(annualPhasingCost.getGobAmount())));
        dto.setGobFe(annualPhasingCost.getGobFeAmount());
        dto.setRpaThroughGob(annualPhasingCost.getGobThruAmount());
        dto.setRpaSpecialAcc(annualPhasingCost.getSpAcAmount());
        dto.setThruPd(annualPhasingCost.getThruPdAmount());
        dto.setThruDp(annualPhasingCost.getThruDpAmount());
        dto.setOwnFund(annualPhasingCost.getOwnFundAmount());
        dto.setOwnFundFe(annualPhasingCost.getOwnFundFeAmount());
        dto.setOther(annualPhasingCost.getOtherAmount());
        dto.setOtherFe(annualPhasingCost.getOtherFeAmount());
        return dto;
    }

    private AnnualPhasingCostTotalDTO convertTappAnnualPhasingCost(TappAnnualPhasingCostTotalDTO annualPhasingCost) {
        final DecimalFormat format = new DecimalFormat("0.00");
        AnnualPhasingCostTotalDTO dto = new AnnualPhasingCostTotalDTO();
        dto.setTotal(Double.valueOf(format.format(annualPhasingCost.getTotalAmount())));
        dto.setGob(Double.valueOf(format.format(annualPhasingCost.getGobAmount())));
        dto.setGobFe(annualPhasingCost.getGobFeAmount());
        dto.setRpaThroughGob(annualPhasingCost.getGobThruAmount());
        dto.setRpaSpecialAcc(annualPhasingCost.getSpAcAmount());
        dto.setThruPd(annualPhasingCost.getThruPdAmount());
        dto.setThruDp(annualPhasingCost.getThruDpAmount());
        dto.setOwnFund(annualPhasingCost.getOwnFundAmount());
        dto.setOwnFundFe(annualPhasingCost.getOwnFundFeAmount());
        dto.setOther(annualPhasingCost.getOtherAmount());
        dto.setOtherFe(annualPhasingCost.getOtherFeAmount());
        return dto;
    }

    private List<AnnualCostTotalWithFiscalYear> convertDppCost(List<DppAnnualCostTotalWithFiscalYear> grandTotal) {
        List<AnnualCostTotalWithFiscalYear> result = new ArrayList<>();
        for (DppAnnualCostTotalWithFiscalYear total : grandTotal) {
            AnnualCostTotalWithFiscalYear dto = new AnnualCostTotalWithFiscalYear();
            dto.setFiscalYear(total.getFiscalYear());
            dto.setCost(convertDppAnnualPhasingCost(total.getDppAnnualPhasingCostTotal()));
            result.add(dto);
        }

        return result;
    }

    private List<AnnualCostTotalWithFiscalYear> convertTappCost(List<TappAnnualCostTotalWithFiscalYear> grandTotal) {
        List<AnnualCostTotalWithFiscalYear> result = new ArrayList<>();
        for (TappAnnualCostTotalWithFiscalYear total : grandTotal) {
            AnnualCostTotalWithFiscalYear dto = new AnnualCostTotalWithFiscalYear();
            dto.setFiscalYear(total.getFiscalYear());
            dto.setCost(convertTappAnnualPhasingCost(total.getTappAnnualPhasingCostTotal()));
            result.add(dto);
        }

        return result;
    }

    private ComponentWiseCostDTO setComponentWiseCost(DetailsEstimatedCostResponse itemWiseEstimatedCost) {
        ComponentWiseCostDTO result = new ComponentWiseCostDTO();

        List<CostTabDetailsDTO> estimatedCostRevenue = new ArrayList<>();
        List<CostTabDetailsDTO> estimatedCostCapital = new ArrayList<>();
        if (itemWiseEstimatedCost.getRevenue() != null) {
            itemWiseEstimatedCost.getRevenue().getEstimatedCostTabDetailsDTOS().forEach(cost->estimatedCostRevenue.add(convertComponentCost(cost)));
        }
        if (itemWiseEstimatedCost.getCapital() != null) {
            itemWiseEstimatedCost.getCapital().getEstimatedCostTabDetailsDTOS().forEach(cost->estimatedCostCapital.add(convertComponentCost(cost)));
        }

        result.setRevenue(estimatedCostRevenue);
        result.setCapital(estimatedCostCapital);
        if (itemWiseEstimatedCost.getContingency() != null) {
            result.setPhysicalContingency(convertComponentCost(itemWiseEstimatedCost.getContingency().getEstimatedCostTabDetailsDTOS().get(0)));
            result.setPriceContingency(convertComponentCost(itemWiseEstimatedCost.getContingency().getEstimatedCostTabDetailsDTOS().get(1)));
        }

        return result;
    }

    private CostTabDetailsDTO convertComponentCost(EstimatedCostTabDetailsDTO annualPhasingCost) {
        final DecimalFormat format = new DecimalFormat("0.00");
        CostTabDetailsDTO dto = new CostTabDetailsDTO();
        dto.setSubEconomicCode(annualPhasingCost.getSubEconomicCode()==null?"":annualPhasingCost.getSubEconomicCode().getSubEconomicCode());
        dto.setUnitTypeCode(annualPhasingCost.getUnitType()==null?"":annualPhasingCost.getUnitType().getCode());
        dto.setUnitCost(annualPhasingCost.getUnitCost()==null?0:Double.valueOf(format.format(annualPhasingCost.getUnitCost())));
        dto.setQty(annualPhasingCost.getQty());
        dto.setTotal(Double.valueOf(format.format(annualPhasingCost.getTotalAmount())));
        dto.setGob(annualPhasingCost.getGobAmount());
        dto.setGobFe(annualPhasingCost.getGobFeAmount());
        dto.setRpaThroughGob(annualPhasingCost.getGobThruAmount());
        dto.setRpaSpecialAcc(annualPhasingCost.getSpAcAmount());
        dto.setThruPd(annualPhasingCost.getThruPdAmount());
        dto.setThruDp(annualPhasingCost.getThruDpAmount());
        dto.setOwnFund(annualPhasingCost.getOwnFundAmount());
        dto.setOwnFundFe(annualPhasingCost.getOwnFundFeAmount());
        dto.setOther(annualPhasingCost.getOtherAmount());
        dto.setOtherFe(annualPhasingCost.getOtherFeAmount());
        return dto;
    }

    private CostTabDetailsDTO convertComponentCost(DppFiscalYearDTO dppFiscalYearDTO, DppAnnualPhasingCostTabDetailsDTO detailsDTO) {
        final DecimalFormat format = new DecimalFormat("0.00");
        CostTabDetailsDTO dto = new CostTabDetailsDTO();
        dto.setSubEconomicCode(detailsDTO.getSubEconomicCodeDTO()==null?"":detailsDTO.getSubEconomicCodeDTO().getSubEconomicCode());
        dto.setUnitTypeCode(detailsDTO.getUnitId()==null?"":detailsDTO.getUnitTypeDTO().getCode());
        dto.setUnitCost(detailsDTO.getUnitCost()==null?0:Double.valueOf(format.format(detailsDTO.getUnitCost())));
        dto.setQty(detailsDTO.getQty());
        dto.setTotal(Double.valueOf(format.format(dppFiscalYearDTO.getTotalAmount())));
        dto.setGob(dppFiscalYearDTO.getGobAmount());
        dto.setGobFe(dppFiscalYearDTO.getGobFeAmount());
        dto.setRpaThroughGob(dppFiscalYearDTO.getGobThruAmount());
        dto.setRpaSpecialAcc(dppFiscalYearDTO.getSpAcAmount());
        dto.setThruPd(dppFiscalYearDTO.getThruPdAmount());
        dto.setThruDp(dppFiscalYearDTO.getThruDpAmount());
        dto.setOwnFund(dppFiscalYearDTO.getOwnFundAmount());
        dto.setOwnFundFe(dppFiscalYearDTO.getOwnFundFeAmount());
        dto.setOther(dppFiscalYearDTO.getOtherAmount());
        dto.setOtherFe(dppFiscalYearDTO.getOtherFeAmount());
        return dto;
    }

    private List<YearWiseComponentWiseCostDTO> setYearWiseComponentWiseCost(Long pcId) {
        List<YearWiseComponentWiseCostDTO> result = new ArrayList<>();
        ProjectConceptIdAndComponentNameRequest request = new ProjectConceptIdAndComponentNameRequest();
        request.setProjectConceptId(pcId);
        request.setComponentName("Revenue_Component");
        ResponseEntity<DppAnnualPhasingCostWithChildResponse> revenueResponse = dppAnnualPhasingCostService.getByProjectConceptIdAndComponentName(request);
        request.setComponentName("Capital_Component");
        ResponseEntity<DppAnnualPhasingCostWithChildResponse> capitalResponse = dppAnnualPhasingCostService.getByProjectConceptIdAndComponentName(request);
        request.setComponentName("Contingency");
        ResponseEntity<DppAnnualPhasingCostWithChildResponse> contingencyResponse = dppAnnualPhasingCostService.getByProjectConceptIdAndComponentName(request);

        List<DppAnnualPhasingCostTabDetailsDTO> revenueCostDetails = null;
        List<FiscalYearWiseData> revenueFiscalYearWiseCost = null;
        if (revenueResponse.getBody() != null) {
            revenueCostDetails = revenueResponse.getBody().getDppAnnualPhasingCostTabDetails();
            revenueFiscalYearWiseCost = revenueResponse.getBody().getFiscalYearWiseCost();
        }

        List<DppAnnualPhasingCostTabDetailsDTO> capitalCostDetails = null;
        List<FiscalYearWiseData> capitalFiscalYearWiseCost = null;
        if (capitalResponse.getBody() != null) {
            capitalCostDetails = capitalResponse.getBody().getDppAnnualPhasingCostTabDetails();
            capitalFiscalYearWiseCost = capitalResponse.getBody().getFiscalYearWiseCost();
        }

        List<DppAnnualPhasingCostTabDetailsDTO> contingencyCostDetails = null;
        List<FiscalYearWiseData> contingencyFiscalYearWiseCost = null;
        if (contingencyResponse.getBody() != null) {
            contingencyCostDetails = contingencyResponse.getBody().getDppAnnualPhasingCostTabDetails();
            contingencyFiscalYearWiseCost = contingencyResponse.getBody().getFiscalYearWiseCost();
        }

        if (revenueFiscalYearWiseCost != null) {
            for (int i = 0; i < revenueFiscalYearWiseCost.size(); i++) {
                FiscalYearWiseData fyRevenueData = revenueFiscalYearWiseCost.get(i);
                FiscalYearWiseData fyCapitalData = null;
                if (capitalFiscalYearWiseCost != null) {
                    fyCapitalData = capitalFiscalYearWiseCost.get(i);
                }

                FiscalYearWiseData fyContingencyData = null;
                if (contingencyFiscalYearWiseCost != null) {
                    fyContingencyData = contingencyFiscalYearWiseCost.get(i);
                }

                YearWiseComponentWiseCostDTO yearWiseComponentWiseCost = new YearWiseComponentWiseCostDTO();
                yearWiseComponentWiseCost.setFiscalYear(fyRevenueData.getFiscalYear());
                ComponentWiseCostDTO componentWiseCost = new ComponentWiseCostDTO();

                List<CostTabDetailsDTO> revenueList = new ArrayList<>();
                if (revenueCostDetails != null) {
                    for (int j = 0; j < fyRevenueData.getValues().size(); j++) {
                        revenueList.add(convertComponentCost(fyRevenueData.getValues().get(j), revenueCostDetails.get(j)));
                    }
                }
                componentWiseCost.setRevenue(revenueList);

                List<CostTabDetailsDTO> capitalList = new ArrayList<>();
                if (fyCapitalData != null && capitalCostDetails != null) {
                    for (int j = 0; j < fyCapitalData.getValues().size(); j++) {
                        capitalList.add(convertComponentCost(fyCapitalData.getValues().get(j), capitalCostDetails.get(j)));
                    }
                }
                componentWiseCost.setCapital(capitalList);

                if (fyContingencyData != null) {
                    componentWiseCost.setPhysicalContingency(convertComponentCost(fyContingencyData.getValues().get(0), contingencyCostDetails.get(0)));
                    componentWiseCost.setPriceContingency(convertComponentCost(fyContingencyData.getValues().get(1), contingencyCostDetails.get(1)));
                }

                yearWiseComponentWiseCost.setComponentWiseCost(componentWiseCost);
                result.add(yearWiseComponentWiseCost);
            }
        }

        return result;
    }

    private List<ShortModeFinancingDTO> convertModeOfFinance(List<ModeOfFinanceDTO> financeList,
                                                             List<DppModeFinancingDTO> list, List<DppDevelopmentPartnersDTO> developmentPartnersList) {
        List<ShortModeFinancingDTO> result = new ArrayList<>();
        if (list==null) return null;
        DppDevelopmentPartnersDTO partner = null;
        for (DppModeFinancingDTO mode : list) {
            Optional<ModeOfFinanceDTO> modeFinance = financeList.stream().filter(m -> m.getId().equals(mode.getModeId())).findFirst();
            if (developmentPartnersList != null) {
                Optional<DppDevelopmentPartnersDTO> partnersDTO = developmentPartnersList.stream().filter(m -> m.getModeFinanceId().equals(mode.getModeId())).findFirst();
                if (partnersDTO.isPresent()) partner = partnersDTO.get();
            }
            ShortModeFinancingDTO dto = new ShortModeFinancingDTO();
            dto.setModeFinanceCode(modeFinance.isPresent()?modeFinance.get().getCode():"");
            dto.setGob(mode.getGob());
            dto.setGobFe(mode.getGobFe());
            dto.setPa(mode.getPa());
            dto.setPaRpa(mode.getPaRpa());
            dto.setOwnFund(mode.getOwnFund());
            dto.setOwnFundFe(mode.getOwnFundFe());
            dto.setOther(mode.getOthers());
            dto.setOtherFe(mode.getOthersFe());
            dto.setPaSourceCode(partner==null?"":configurationClientService.getDevelopmentPartnerById(partner.getDevPartnerId()).getCode());
            result.add(dto);
        }

        return result;
    }

    private List<ShortModeFinancingDTO> convertTappModeOfFinance(List<ModeOfFinanceDTO> financeList,
                                                                 List<DppModeFinancingDTO> list, List<TappDevelopmentPartnersDTO> developmentPartnersList) {
        List<ShortModeFinancingDTO> result = new ArrayList<>();
        if (list==null) return null;
        TappDevelopmentPartnersDTO partner = null;
        for (DppModeFinancingDTO mode : list) {
            Optional<ModeOfFinanceDTO> modeFinance = financeList.stream().filter(m -> m.getId().equals(mode.getModeId())).findFirst();
            if (developmentPartnersList != null) {
                partner = developmentPartnersList.stream().filter(m -> m.getModeFinanceId().equals(mode.getModeId())).findFirst().get();
            }
            ShortModeFinancingDTO dto = new ShortModeFinancingDTO();
            dto.setModeFinanceCode(modeFinance.isPresent()?modeFinance.get().getCode():"");
            dto.setGob(mode.getGob());
            dto.setGobFe(mode.getGobFe());
            dto.setPa(mode.getPa());
            dto.setPaRpa(mode.getPaRpa());
            dto.setOwnFund(mode.getOwnFund());
            dto.setOwnFundFe(mode.getOwnFundFe());
            dto.setOther(mode.getOthers());
            dto.setOtherFe(mode.getOthersFe());
            dto.setPaSourceCode(partner==null?"":configurationClientService.getDevelopmentPartnerById(partner.getDevPartnerId()).getCode());
            result.add(dto);
        }

        return result;
    }

    private List<ProcurementPlanDetails> convertProcurementPlan(List<AnnexureGoodsDetailsRequest> list, String type) {
        List<ProcurementPlanDetails> result = new ArrayList<>();
        if (list==null) return null;
        for (AnnexureGoodsDetailsRequest detail : list) {
            ProcurementPlanDetails dto = new ProcurementPlanDetails();
            dto.setPackageName(detail.getPackageName());
            if (type.equals("Goods") || type.equals("Works")) {
                dto.setDescription(detail.getTappGoods());
            } else if (type.equals("Service")) {
                dto.setDescription(detail.getPackageDppTppService());
                dto.setInvitationForEoi(detail.getInvitationForEoi());
            }
            dto.setUnitTypeCode(detail.getUnitTypeDTO().getCode());
            dto.setQuantity(detail.getQuantity());
            dto.setProcurementMethodCode(detail.getProcurementMethod().getCode());
            dto.setProcurementTypeCode(detail.getProcurementType().getCode());
            dto.setContractApprovalAuthority(detail.getContractApproveAuthoriity());
            dto.setSourceOfFund(detail.getSourceOfFund());
            dto.setEstimatedCost(detail.getEstdCostAmount());
            dto.setInvitationForTender(detail.getInvitationForTender());
            dto.setSigningOfContract(detail.getSigningOfContract());
            dto.setCompletionOfContract(detail.getCompletionOfContract());
            result.add(dto);
        }

        return result;
    }

    private List<ProcurementPlanDetails> convertTappProcurementPlan(List<TappAnnexureGoodsDetailDTO> list, String type) {
        List<ProcurementPlanDetails> result = new ArrayList<>();
        if (list==null) return null;
        for (TappAnnexureGoodsDetailDTO detail : list) {
            ProcurementPlanDetails dto = new ProcurementPlanDetails();
            dto.setPackageName(detail.getPackageName());
            if (type.equals("Tapp-Goods")) {
                dto.setDescription(detail.getTappGoods());
            } else if (type.equals("Tapp-Service")) {
                dto.setDescription(detail.getPackageDppTppService());
            }
            dto.setUnitTypeCode(detail.getUnitType().getCode());
            dto.setQuantity(detail.getQuantity().doubleValue());
            dto.setProcurementMethodCode(detail.getProcurementMethod().getCode());
            dto.setProcurementTypeCode(detail.getProcurementType().getCode());
            dto.setContractApprovalAuthority(detail.getContractApproveAuthoriity());
            dto.setSourceOfFund(detail.getSourceOfFund());
            dto.setEstimatedCost(detail.getEstdCostAmount());
            dto.setInvitationForTender(detail.getInvitationForTender());
            dto.setSigningOfContract(detail.getSigningOfContract());
            dto.setCompletionOfContract(detail.getCompletionOfContract());
            result.add(dto);
        }

        return result;
    }

    /*private void setApprovalInfo2(SpimsApprovedProjectDetailInfoDTO data, ProjectMovementStage currentStage) {
        if (currentStage!=null && currentStage.getCurrentStage().toString().contains("_")) {
            String[] text = currentStage.getCurrentStage().toString().split("_");
            if (text[0].equals("APPROVED")) {
                String[] authName = currentStage.getCurrentStage().toString().split("_BY_");
                data.setApprovalAuthority(authName[1].replace('_',' '));
                data.setDateOfApproval(currentStage.getMovementTime().toLocalDate());
            }
        }
    }*/

    private List<ShortLocationWiseBreakdownDTO> convertLocationWiseCost(List<DppLocationWiseBreakdownDTO> list) {
        List<ShortLocationWiseBreakdownDTO> result = new ArrayList<>();
        if (list==null) return null;

        List<DivisionRequest> selectedDivisionList = getSelectedDivision(list);
        List<ZillaRequest> selectedZillaList = getSelectedZilla(list);
        List<UpaZillaRequest> selectedUpazilaList = getSelectedUpazila(list);

        for (DppLocationWiseBreakdownDTO location : list) {
            ShortLocationWiseBreakdownDTO dto = new ShortLocationWiseBreakdownDTO();
            dto.setDivisionGeoCode(selectedDivisionList.stream().filter(m->m.getId().equals(location.getDivisionId())).map(m->m.getGeoCode()).findFirst().get());
            if (location.getZillaId() !=null) dto.setZillaGeoCode(selectedZillaList.stream().filter(m->m.getId().equals(location.getZillaId())).map(m->m.getGeoCode()).findFirst().get());
            if (location.getUpazilaId() !=null) dto.setUpazilaGeoCode(selectedUpazilaList.stream().filter(m->m.getId().equals(location.getUpazilaId())).map(m->m.getGeoCode()).findFirst().get());
            dto.setDescription(Jsoup.parse(location.getQuantity()).text());
            dto.setEstimatedCost(location.getEstimatedCost());
            dto.setComment(location.getComment());
            result.add(dto);
        }

        return result;
    }

    private List<DivisionRequest> getSelectedDivision(List<DppLocationWiseBreakdownDTO> list) {
        Set<Long> divisions = list.stream().map(DppLocationWiseBreakdownDTO::getDivisionId).collect(Collectors.toSet());
        List<DivisionRequest> selectedDivisionList = configurationClientService.getDivisionByIdSet(
                new IdSetRequestBodyDTO() {{
                    setIds(divisions);
                }}
        );
        return selectedDivisionList;
    }

    private List<ZillaRequest> getSelectedZilla(List<DppLocationWiseBreakdownDTO> list) {
        Set<Long> zillas = list.stream().map(DppLocationWiseBreakdownDTO::getZillaId).collect(Collectors.toSet());
        List<ZillaRequest> selectedZillaList = new ArrayList<>();
        if (zillas.size()>0) {
            selectedZillaList = configurationClientService.getZillaByIdSet(
                    new IdSetRequestBodyDTO() {{
                        setIds(zillas);
                    }}
            );
        }
        return selectedZillaList;
    }

    private List<UpaZillaRequest> getSelectedUpazila(List<DppLocationWiseBreakdownDTO> list) {
        Set<Long> upazilas = list.stream().map(DppLocationWiseBreakdownDTO::getUpazilaId).collect(Collectors.toSet());
        List<UpaZillaRequest> selectedUpazilaList = new ArrayList<>();
        if (upazilas.size()>0) {
            selectedUpazilaList = configurationClientService.getUpazillaByIdSet(
                    new IdSetRequestBodyDTO() {{
                        setIds(upazilas);
                    }}
            );
        }
        return selectedUpazilaList;
    }

    private List<ShortAnnualCostTotalWithFiscalYear> setYearWiseCost(List<DppAnnualCostTotalWithFiscalYear> grandTotal) {
        List<ShortAnnualCostTotalWithFiscalYear> yearWiseEstimatedCost = new ArrayList<>();
        for (DppAnnualCostTotalWithFiscalYear grantTotalFiscalYear : grandTotal) {
            ShortAnnualCostTotalWithFiscalYear costTotalWithFiscalYear = new ShortAnnualCostTotalWithFiscalYear();
            ShortAnnualPhasingCostTotalDTO phasingCost = new ShortAnnualPhasingCostTotalDTO();
            phasingCost.setGobAmount(grantTotalFiscalYear.getDppAnnualPhasingCostTotal().getGobAmount());
            phasingCost.setGobFeAmount(grantTotalFiscalYear.getDppAnnualPhasingCostTotal().getGobFeAmount());
            phasingCost.setOwnFundAmount(grantTotalFiscalYear.getDppAnnualPhasingCostTotal().getOwnFundAmount());
            phasingCost.setOwnFundFeAmount(grantTotalFiscalYear.getDppAnnualPhasingCostTotal().getOwnFundFeAmount());
            phasingCost.setOtherAmount(grantTotalFiscalYear.getDppAnnualPhasingCostTotal().getOtherAmount());
            phasingCost.setOtherFeAmount(grantTotalFiscalYear.getDppAnnualPhasingCostTotal().getOtherFeAmount());
            phasingCost.setTotalAmount(grantTotalFiscalYear.getDppAnnualPhasingCostTotal().getTotalAmount());

            costTotalWithFiscalYear.setFiscalYear(grantTotalFiscalYear.getFiscalYear());
            costTotalWithFiscalYear.setAnnualPhasingCost(phasingCost);
            yearWiseEstimatedCost.add(costTotalWithFiscalYear);
        }
        return yearWiseEstimatedCost;
    }

    private List<ShortAnnualCostTotalWithFiscalYear> setYearWiseCostForTapp(List<TappAnnualCostTotalWithFiscalYear> grandTotal) {
        List<ShortAnnualCostTotalWithFiscalYear> yearWiseEstimatedCost = new ArrayList<>();
        for (TappAnnualCostTotalWithFiscalYear grantTotalFiscalYear : grandTotal) {
            ShortAnnualCostTotalWithFiscalYear costTotalWithFiscalYear = new ShortAnnualCostTotalWithFiscalYear();
            ShortAnnualPhasingCostTotalDTO phasingCost = new ShortAnnualPhasingCostTotalDTO();
            phasingCost.setGobAmount(grantTotalFiscalYear.getTappAnnualPhasingCostTotal().getGobAmount());
            phasingCost.setGobFeAmount(grantTotalFiscalYear.getTappAnnualPhasingCostTotal().getGobFeAmount());
            phasingCost.setOwnFundAmount(grantTotalFiscalYear.getTappAnnualPhasingCostTotal().getOwnFundAmount());
            phasingCost.setOwnFundFeAmount(grantTotalFiscalYear.getTappAnnualPhasingCostTotal().getOwnFundFeAmount());
            phasingCost.setOtherAmount(grantTotalFiscalYear.getTappAnnualPhasingCostTotal().getOtherAmount());
            phasingCost.setOtherFeAmount(grantTotalFiscalYear.getTappAnnualPhasingCostTotal().getOtherFeAmount());
            phasingCost.setTotalAmount(grantTotalFiscalYear.getTappAnnualPhasingCostTotal().getTotalAmount());

            costTotalWithFiscalYear.setFiscalYear(grantTotalFiscalYear.getFiscalYear());
            costTotalWithFiscalYear.setAnnualPhasingCost(phasingCost);
            yearWiseEstimatedCost.add(costTotalWithFiscalYear);
        }
        return yearWiseEstimatedCost;
    }

}

