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
import com.ibcs.idsdp.dpptapp.model.repositories.LogFrameRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappLogFrameRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappModeOnFinanceRepository;
import com.ibcs.idsdp.dpptapp.services.*;
import com.ibcs.idsdp.dpptapp.services.implementation.annexIII_aGoods.AnnexureGoodServiceImp;
import com.ibcs.idsdp.dpptapp.services.implementation.tappAnnexurs.TappAnnexureGoodServiceImp;
import com.ibcs.idsdp.dpptapp.web.dto.*;
import com.ibcs.idsdp.dpptapp.web.dto.request.PpsCodeEpimsCodeDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.ProcurementPlanDetails;
import com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs.TappAnnexureGoodsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.jsoup.Jsoup;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DecimalFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
@Transactional
public class ProjectInfoServiceImpl implements ProjectInfoService {

    private final DppObjectiveCostService dppObjectiveCostService;
    private final TappObjectiveCostService tappObjectiveCostService;

    private final ProjectConceptClientService projectConceptClientService;
    private final ProjectMovementService projectMovementService;
    private final ConfigurationClientService configClientService;
    private final DppTappGoService dppTappGoService;
    private final LogFrameRepository dppLogFrameRepository;
    private final TappLogFrameRepository tappLogFrameRepository;
    private final DppLocationService dppLocationService;
    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final DppAnnualPhasingCostService dppAnnualPhasingCostService;
    private final TappAnnualPhasingCostService tappAnnualPhasingCostService;
    private TappModeOnFinanceRepository tappModeOnFinanceRepository;
    private AnnexureGoodServiceImp annexureGoodServiceImp;
    private TappAnnexureGoodServiceImp tappAnnexureGoodServiceImp;
    private DppLocationWiseBreakdownServiceImpl dppLocationWiseBreakdownService;

    private final ConfigurationClientService configurationClientService;
    private final ProjectDetailsPartBServiceImpl projectDetailsPartBService;
    private final EffectImpactServiceImpl effectImpactService;
    private final DppOtherDetailsServiceImpl dppOtherDetailsService;

    @Override
    public ProjectInfoResultDTO getProjectInfoByProjectCode(String projectCode) {
        ProjectInfoResultDTO result = new ProjectInfoResultDTO();
        ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptByPpsCode(projectCode);
        if (pcInfo != null) {
            if (pcInfo.getProjectTypeDTO().getNameEn().equals("DPP")) {
                setDppInfo(pcInfo, result, projectCode);
            } else if (pcInfo.getProjectTypeDTO().getNameEn().equals("TAPP")) {
                setTappInfo(pcInfo, result, projectCode);
            }
        } else {
            result.setStatus("fail");
            result.setMessage("Project Not Found!");
            result.setData(new ProjectInfoDTO());
            return result;
        }

        return result;
    }

    private void setDppInfo(ProjectConceptResponse pcInfo, ProjectInfoResultDTO result, String projectCode) {
        ProjectMovementStage currentStage = null;
        DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        if (dppInfo!=null) currentStage = projectMovementService.getCurrentStageInDpp(dppInfo.getId());
        AgencyDTO agencyDTO = configClientService.getAgencyById(pcInfo.getAgencyId());
        DppTappGo dppGO = dppTappGoService.findByPcUuidAndOrderType(pcInfo.getUuid(), "GO");
        DppTappGo dppAO = dppTappGoService.findByPcUuidAndOrderType(pcInfo.getUuid(), "AO");
        SectorDivisionDTO sectorDivision = dppInfo==null?null:configClientService.getBySectorDivisionId(pcInfo.getSectorDivisionId());
        SectorDTO sector = configClientService.getBySectorId(pcInfo.getSectorId());
        SubSectorDTO subSector = configClientService.getBySubSectorId(pcInfo.getSubSectorId());

        ProjectInfoDTO data = new ProjectInfoDTO();
        data.setId(pcInfo.getId().toString());
        data.setCode(projectCode);
        data.setProject_revision_no(0);
        data.setName(dppInfo==null?pcInfo.getTitleEn():dppInfo.getProjectTitleEn());
        data.setName_bangla(dppInfo==null?pcInfo.getTitleBn():dppInfo.getProjectTitleBn());
        data.setMinistry_code(agencyDTO==null?"":agencyDTO.getMinistryDivisionDTO().getCode());
        data.setMinistry_name(pcInfo.getSponsoringMinistryName());
        data.setAgency_code(agencyDTO==null?"":agencyDTO.getCode());
        data.setAgency_name(pcInfo.getImplementingAgencyName());
        data.setConcerned_planning_commission_division_code(sectorDivision==null?"":sectorDivision.getCode());
        data.setConcerned_planning_commission_division_name(sectorDivision==null?"":sectorDivision.getSectorDivisionNameEn());
        data.setHas_multiple_agency(false);
        data.setIs_self_financed(pcInfo.getIsSelfFund());
        data.setAdp_sector_code(sector.getCode());
        data.setAdp_sector_name(sector.getSectorNameEn());
        data.setAdp_sub_sector_code(subSector.getCode());
        data.setAdp_sub_sector_name(subSector.getSubSectorNameEn());
        data.setHas_foreign_location(false);

        currentStageData(data, currentStage);
        data.setGo_issue_date(dppGO!=null?dppGO.getRecordDate():null);
        data.setAdministrative_order_date(dppAO!=null?dppAO.getRecordDate():null);
        data.setDate_of_commencement(dppInfo==null?pcInfo.getExpCommencementDate():dppInfo.getDateCommencement());
        data.setDate_of_completion(dppInfo==null?pcInfo.getExpCompletionDate():dppInfo.getDateCompletion());
        data.setProject_type_id(pcInfo.getProjectTypeId().toString());
        data.setProject_type_name(pcInfo.getProjectTypeDTO().getNameEn());

        result.setStatus("success");
        result.setMessage("Project Found!");
        result.setData(data);
    }

    private void setTappInfo(ProjectConceptResponse pcInfo, ProjectInfoResultDTO result, String projectCode) {
        ProjectMovementStage currentStage = null;
        TappObjectiveCostDTO tappInfo = tappObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        if (tappInfo!=null) currentStage = projectMovementService.getCurrentStageInDpp(tappInfo.getId());
        AgencyDTO agencyDTO = configClientService.getAgencyById(pcInfo.getAgencyId());
        DppTappGo dppGO = dppTappGoService.findByPcUuidAndOrderType(pcInfo.getUuid(), "GO");
        DppTappGo dppAO = dppTappGoService.findByPcUuidAndOrderType(pcInfo.getUuid(), "AO");
        SectorDivisionDTO sectorDivision = tappInfo==null?null:configClientService.getBySectorDivisionId(pcInfo.getSectorDivisionId());
        SectorDTO sector = configClientService.getBySectorId(pcInfo.getSectorId());
        SubSectorDTO subSector = configClientService.getBySubSectorId(pcInfo.getSubSectorId());

        ProjectInfoDTO data = new ProjectInfoDTO();
        data.setId(pcInfo.getId().toString());
        data.setCode(projectCode);
        data.setProject_revision_no(0);
        data.setName(tappInfo==null?pcInfo.getTitleEn():tappInfo.getProjectTitleEn());
        data.setName_bangla(tappInfo==null?pcInfo.getTitleBn():tappInfo.getProjectTitleEn());
        data.setMinistry_code(agencyDTO==null?"":agencyDTO.getMinistryDivisionDTO().getCode());
        data.setMinistry_name(pcInfo.getSponsoringMinistryName());
        data.setAgency_code(agencyDTO==null?"":agencyDTO.getCode());
        data.setAgency_name(pcInfo.getImplementingAgencyName());
        data.setConcerned_planning_commission_division_code(sectorDivision==null?"":sectorDivision.getCode());
        data.setConcerned_planning_commission_division_name(sectorDivision==null?"":sectorDivision.getSectorDivisionNameEn());
        data.setHas_multiple_agency(false);
        data.setIs_self_financed(pcInfo.getIsSelfFund());
        data.setAdp_sector_code(sector.getCode());
        data.setAdp_sector_name(sector.getSectorNameEn());
        data.setAdp_sub_sector_code(subSector.getCode());
        data.setAdp_sub_sector_name(subSector.getSubSectorNameEn());
        data.setHas_foreign_location(false);

        currentStageData(data, currentStage);
        data.setGo_issue_date(dppGO!=null?dppGO.getRecordDate():null);
        data.setAdministrative_order_date(dppAO!=null?dppAO.getRecordDate():null);
        data.setDate_of_commencement(pcInfo==null?pcInfo.getExpCommencementDate():tappInfo.getDateCommencement());
        data.setDate_of_completion(pcInfo==null?pcInfo.getExpCompletionDate():tappInfo.getDateCompletion());
        data.setProject_type_id(pcInfo.getProjectTypeId().toString());
        data.setProject_type_name(pcInfo.getProjectTypeDTO().getNameEn());

        result.setStatus("success");
        result.setMessage("Project Found!");
        result.setData(data);
    }

    private void currentStageData(ProjectInfoDTO data, ProjectMovementStage currentStage) {
        if (currentStage!=null && currentStage.getCurrentStage().toString().contains("_")) {
            String[] text = currentStage.getCurrentStage().toString().split("_");
            if (text[0].equals("APPROVED")) {
                String[] authName = currentStage.getCurrentStage().toString().split("_BY_");
                data.setApproval_authority_name(authName[1].replace('_',' '));
                data.setDate_of_approval(currentStage.getMovementTime());
            }
        }
    }

    @Override
    public List<ProjectListResponseDTO> getApprovedDppTapp() {
        List<ProjectListResponseDTO> result = new ArrayList<>();
        List<ProjectConceptResponse> list = projectConceptClientService.getApprovedDppTappForEpims();
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
    public List<ProjectListDTO> getNonApprovedDppTapp() {
        List<ProjectListDTO> result = new ArrayList<>();
        List<ProjectConceptResponse> list = projectConceptClientService.getNonApprovedDppTapp();
        for (ProjectConceptResponse pcInfo : list) {
            ProjectListDTO dto = new ProjectListDTO();
            if (pcInfo.getProjectTypeDTO()!=null && pcInfo.getProjectTypeDTO().getNameEn().equals("DPP")) {
                String projectName = pcInfo.getTitleEn();
                DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getShortInfoByPcUuid(pcInfo.getUuid());
                if (dppInfo != null) {
                    projectName = dppInfo.getProjectTitleEn();
                }
                dto.setPpsCode(pcInfo.getPpsCode());
                dto.setProjectName(projectName);
                result.add(dto);
            } else if (pcInfo.getProjectTypeDTO()!=null && pcInfo.getProjectTypeDTO().getNameEn().equals("TAPP")) {
                String projectName = pcInfo.getTitleEn();
                TappObjectiveCostDTO tappInfo = tappObjectiveCostService.getShortInfoByPcUuid(pcInfo.getUuid());
                if (tappInfo != null) {
                    projectName = tappInfo.getProjectTitleEn();
                }
                dto.setPpsCode(pcInfo.getPpsCode());
                dto.setProjectName(projectName);
                result.add(dto);
            }
        }

        return result;
    }

    @Override
    public ProjectInfoDetailDTO getProjectInfoDetailByPpsCode(String ppsCode) {
        ProjectInfoDetailDTO result = new ProjectInfoDetailDTO();
        ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptByPpsCode(ppsCode);
        if (pcInfo==null) return null;

        result.setProjectNameEn(pcInfo.getTitleEn());
        result.setProjectNameBn(pcInfo.getTitleBn());
        result.setImplementationPeriod(pcInfo.getExpCommencementDate().toString()+" to "+pcInfo.getExpCompletionDate());
        result.setProjectType(pcInfo.getProjectTypeDTO().getNameEn());
        result.setSector(configClientService.getBySectorId(pcInfo.getSectorId()).getSectorNameEn());
        result.setSubSector(configClientService.getBySubSectorId(pcInfo.getSubSectorId()).getSubSectorNameEn());
        result.setPaFunded(pcInfo.getPaAmount()>0?true:false);
        result.setOwnFunded(pcInfo.getOwnFundAmount()>0?true:false);

        if (pcInfo.getProjectTypeDTO().getNameEn().equals("DPP")) {
            setDetailDataForDpp(result, pcInfo);
        } else if (pcInfo.getProjectTypeDTO().getNameEn().equals("TAPP")) {
            setDetailDataForTapp(result, pcInfo);
        }

        return result;
    }

    private void setDetailDataForDpp(ProjectInfoDetailDTO result, ProjectConceptResponse pcInfo) {
        ProjectMovementStage currentStage = null;
        DppLocationResponse dppLocation = null;
        Optional<DppLogFrame> logFrame = dppLogFrameRepository.findAllByProjectConceptUuid(pcInfo.getUuid());
        result.setObjective(logFrame.isPresent()?logFrame.get().getObjectiveNS():"");
        DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        if (dppInfo!=null) currentStage = projectMovementService.getCurrentStageInDpp(dppInfo.getId());
        setEstimatedCostDataForDpp(result, pcInfo.getId());
        DetailsEstimatedCostResponse itemWiseEstimatedCost = dppAnnualPhasingCostService.getDetailsEstimatedCost(pcInfo.getUuid());
        setItemWiseCost(result, itemWiseEstimatedCost);

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
            result.setFinancialAnalysis(financialAnalysisDTO);
        }

        result.setMovementStatus(currentStage==null?"":currentStage.getCurrentStage().toString().replace('_',' '));
        if (dppInfo!=null) dppLocation = dppLocationService.getByProjectSummaryId(dppInfo.getProjectConceptMasterId());
        result.setLocation(dppLocation);
    }

    private void setEstimatedCostDataForDpp(ProjectInfoDetailDTO result, Long pcId) {
        ResponseEntity<List<GrandTotalResponse>> grandTotalList = dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcId);
        for (GrandTotalResponse grandTotalResponse : grandTotalList.getBody()) {
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                DppAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getDppAnnualPhasingCostTotal().get(0);
                ShortAnnualPhasingCostTotalDTO phasingCostTotalDTO = new ShortAnnualPhasingCostTotalDTO();
                phasingCostTotalDTO.setGobAmount(annualCost.getGobAmount());
                phasingCostTotalDTO.setGobFeAmount(annualCost.getGobFeAmount());
                phasingCostTotalDTO.setOwnFundAmount(annualCost.getOwnFundAmount());
                phasingCostTotalDTO.setOwnFundFeAmount(annualCost.getOwnFundFeAmount());
                phasingCostTotalDTO.setOtherAmount(annualCost.getOtherAmount());
                phasingCostTotalDTO.setOtherFeAmount(annualCost.getOtherFeAmount());
                phasingCostTotalDTO.setTotalAmount(annualCost.getTotalAmount());
                result.setEstimatedCost(phasingCostTotalDTO);

                List<ShortAnnualCostTotalWithFiscalYear> yearWiseEstimatedCost = new ArrayList<>();
                List<DppAnnualCostTotalWithFiscalYear> annualGrandTotal = grandTotalResponse.getGrandTotal();
                for (DppAnnualCostTotalWithFiscalYear grantTotalFiscalYear : annualGrandTotal) {
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
                result.setYearWiseEstimatedCost(yearWiseEstimatedCost);
                break;
            }
        }
    }

    private void setDetailDataForTapp(ProjectInfoDetailDTO result, ProjectConceptResponse pcInfo) {
        Optional<TappLogFrame> logFrame = tappLogFrameRepository.findByPcUuid(pcInfo.getUuid());
        result.setObjective(logFrame.isPresent()?logFrame.get().getObjectiveNS():"");
        TappObjectiveCostDTO tappInfo = tappObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        ProjectMovementStage currentStage = projectMovementService.getCurrentStageInTapp(tappInfo.getId());
        setEstimatedCostDataForTapp(result, pcInfo.getId());
        result.setMovementStatus(currentStage==null?"":currentStage.getCurrentStage().toString().replace('_',' '));
        DetailsEstimatedCostResponse itemWiseEstimatedCost = tappAnnualPhasingCostService.getDetailsEstimatedCost(pcInfo.getUuid());
        setItemWiseCost(result, itemWiseEstimatedCost);
    }

    private void setEstimatedCostDataForTapp(ProjectInfoDetailDTO result, Long pcId) {
        ResponseEntity<List<GrandTotalResponseTapp>> grandTotal = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcId);
        for (GrandTotalResponseTapp grandTotalResponse : grandTotal.getBody()) {
            if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {
                TappAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                ShortAnnualPhasingCostTotalDTO phasingCostTotalDTO = new ShortAnnualPhasingCostTotalDTO();
                phasingCostTotalDTO.setGobAmount(annualCost.getGobAmount());
                phasingCostTotalDTO.setGobFeAmount(annualCost.getGobFeAmount());
                phasingCostTotalDTO.setOwnFundAmount(annualCost.getOwnFundAmount());
                phasingCostTotalDTO.setOwnFundFeAmount(annualCost.getOwnFundFeAmount());
                phasingCostTotalDTO.setOtherAmount(annualCost.getOtherAmount());
                phasingCostTotalDTO.setOtherFeAmount(annualCost.getOtherFeAmount());
                phasingCostTotalDTO.setTotalAmount(annualCost.getTotalAmount());
                result.setEstimatedCost(phasingCostTotalDTO);

                List<ShortAnnualCostTotalWithFiscalYear> yearWiseEstimatedCost = new ArrayList<>();
                List<TappAnnualCostTotalWithFiscalYear> annualGrandTotal = grandTotalResponse.getGrandTotal();
                for (TappAnnualCostTotalWithFiscalYear grantTotalFiscalYear : annualGrandTotal) {
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
                result.setYearWiseEstimatedCost(yearWiseEstimatedCost);
                break;
            }
        }
    }

    private void setItemWiseCost(ProjectInfoDetailDTO result, DetailsEstimatedCostResponse estimatedCost) {
        ShortDetailsEstimatedCostResponse detail = new ShortDetailsEstimatedCostResponse();
        ShortEstimatedCostTabDetailsDTO revenue = new ShortEstimatedCostTabDetailsDTO();
        ShortEstimatedCostTabDetailsDTO capital = new ShortEstimatedCostTabDetailsDTO();
        ShortEstimatedCostTabDetailsDTO physicalContingency = new ShortEstimatedCostTabDetailsDTO();
        ShortEstimatedCostTabDetailsDTO priceContingency = new ShortEstimatedCostTabDetailsDTO();
        ShortEstimatedCostTabDetailsDTO grandTotal = new ShortEstimatedCostTabDetailsDTO();

        if (estimatedCost.getRevenue()!=null) {
            EstimatedCostTabDetailsDTO revenueResponses = estimatedCost.getRevenue().getEstimatedCostTabDetailsDTOS().get(0);
            EstimatedCostTabDetailsDTO capitalResponses = estimatedCost.getCapital().getEstimatedCostTabDetailsDTOS().get(0);
            EstimatedCostTabDetailsDTO physicalContingencyResponses = estimatedCost.getContingency().getEstimatedCostTabDetailsDTOS().get(0);
            EstimatedCostTabDetailsDTO priceContingencyResponses = estimatedCost.getContingency().getEstimatedCostTabDetailsDTOS().get(1);
            DppAnnualPhasingCostTotalDTO grandTotalResponses = estimatedCost.getGrandTotalResponses();

            revenue.setDescription(revenueResponses.getDescription());
            revenue.setUnitTypeName(revenueResponses.getUnitType().getUnitTypeNameEng());
            revenue.setUnitCost(revenueResponses.getUnitCost());
            revenue.setQty(revenueResponses.getQty());
            revenue.setGobAmount(revenueResponses.getGobAmount());
            revenue.setGobFeAmount(revenueResponses.getGobFeAmount());
            revenue.setOwnFundAmount(revenueResponses.getOwnFundAmount());
            revenue.setOwnFundFeAmount(revenueResponses.getOwnFundFeAmount());
            revenue.setOtherAmount(revenueResponses.getOtherAmount());
            revenue.setOtherFeAmount(revenueResponses.getOtherFeAmount());
            revenue.setTotalAmount(revenueResponses.getTotalAmount());
            revenue.setTotalProjectCost(revenueResponses.getTotalProjectCost());
            detail.setRevenue(revenue);

            capital.setDescription(capitalResponses.getDescription());
            capital.setUnitTypeName(capitalResponses.getUnitType().getUnitTypeNameEng());
            capital.setUnitCost(capitalResponses.getUnitCost());
            capital.setQty(capitalResponses.getQty());
            capital.setGobAmount(capitalResponses.getGobAmount());
            capital.setGobFeAmount(capitalResponses.getGobFeAmount());
            capital.setOwnFundAmount(capitalResponses.getOwnFundAmount());
            capital.setOwnFundFeAmount(capitalResponses.getOwnFundFeAmount());
            capital.setOtherAmount(capitalResponses.getOtherAmount());
            capital.setOtherFeAmount(capitalResponses.getOtherFeAmount());
            capital.setTotalAmount(capitalResponses.getTotalAmount());
            capital.setTotalProjectCost(capitalResponses.getTotalProjectCost());
            detail.setCapital(capital);

            physicalContingency.setDescription(physicalContingencyResponses.getDescription());
            physicalContingency.setUnitCost(physicalContingencyResponses.getUnitCost());
            physicalContingency.setQty(physicalContingencyResponses.getQty());
            physicalContingency.setGobAmount(physicalContingencyResponses.getGobAmount());
            physicalContingency.setGobFeAmount(physicalContingencyResponses.getGobFeAmount());
            physicalContingency.setOwnFundAmount(physicalContingencyResponses.getOwnFundAmount());
            physicalContingency.setOwnFundFeAmount(physicalContingencyResponses.getOwnFundFeAmount());
            physicalContingency.setOtherAmount(physicalContingencyResponses.getOtherAmount());
            physicalContingency.setOtherFeAmount(physicalContingencyResponses.getOtherFeAmount());
            physicalContingency.setTotalAmount(physicalContingencyResponses.getTotalAmount());
            physicalContingency.setTotalProjectCost(physicalContingencyResponses.getTotalProjectCost());
            detail.setPhysicalContingency(physicalContingency);

            priceContingency.setDescription(priceContingencyResponses.getDescription());
            priceContingency.setUnitCost(priceContingencyResponses.getUnitCost());
            priceContingency.setQty(priceContingencyResponses.getQty());
            priceContingency.setGobAmount(priceContingencyResponses.getGobAmount());
            priceContingency.setGobFeAmount(priceContingencyResponses.getGobFeAmount());
            priceContingency.setOwnFundAmount(priceContingencyResponses.getOwnFundAmount());
            priceContingency.setOwnFundFeAmount(priceContingencyResponses.getOwnFundFeAmount());
            priceContingency.setOtherAmount(priceContingencyResponses.getOtherAmount());
            priceContingency.setOtherFeAmount(priceContingencyResponses.getOtherFeAmount());
            priceContingency.setTotalAmount(priceContingencyResponses.getTotalAmount());
            priceContingency.setTotalProjectCost(priceContingencyResponses.getTotalProjectCost());
            detail.setPriceContingency(priceContingency);

            grandTotal.setQty(grandTotalResponses.getQty());
            grandTotal.setGobAmount(grandTotalResponses.getGobAmount());
            grandTotal.setGobFeAmount(grandTotalResponses.getGobFeAmount());
            grandTotal.setOwnFundAmount(grandTotalResponses.getOwnFundAmount());
            grandTotal.setOwnFundFeAmount(grandTotalResponses.getOwnFundFeAmount());
            grandTotal.setOtherAmount(grandTotalResponses.getOtherAmount());
            grandTotal.setOtherFeAmount(grandTotalResponses.getOtherFeAmount());
            grandTotal.setTotalAmount(grandTotalResponses.getTotalAmount());
            grandTotal.setTotalProjectCost(grandTotalResponses.getTotalProjectCost());
            detail.setGrandTotal(grandTotal);

            result.setItemWiseCost(detail);
        }
    }

    @Override
    public PimsProjectDetailInfoResultDTO getFullInfoByProjectCode(String projectCode) {
        PimsProjectDetailInfoResultDTO result = new PimsProjectDetailInfoResultDTO();
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
            result.setData(new PimsApprovedProjectDetailInfoDTO());
            return result;
        }
        return result;
    }

    private void setDppDetailInfo(ProjectConceptResponse pcInfo, PimsProjectDetailInfoResultDTO result) {
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

        PimsApprovedProjectDetailInfoDTO data = new PimsApprovedProjectDetailInfoDTO();
        data.setPpsCode(pcInfo.getPpsCode());
        data.setProjectName(dppInfo==null?pcInfo.getTitleEn():dppInfo.getProjectTitleEn());
        data.setProjectNameBn(dppInfo==null?pcInfo.getTitleBn():dppInfo.getProjectTitleBn());
        data.setMinistryCode(agencyDTO==null?"":agencyDTO.getMinistryDivisionDTO().getCode());
        data.setAgencyCode(agencyDTO==null?"":agencyDTO.getCode());
        data.setAdpSectorCode(sector.getCode());
        data.setAdpSubSectorCode(sector.getCode()+subSector.getCode());

        data.setPovertySituation(projectDetails == null ? "" : Jsoup.parse(projectDetails.getPovertySituation()).text());
        data.setEnvironmentalSustainability(effectImpact == null ? "" : Jsoup.parse(effectImpact.getEnvSustainabilityLand()).text());
        data.setDisasterManagement(effectImpact == null ? "" : Jsoup.parse(effectImpact.getFutureDisasterManagement()).text());
        data.setWomenDevelopmentImpact(effectImpact == null ? "" : Jsoup.parse(effectImpact.getGenderDisabilityGroups()).text());
        data.setEnvironmentalImpactWiseCategory(effectImpact == null ? "" : Jsoup.parse(effectImpact.getEnvironmentalProjectCategory()==null?"":effectImpact.getEnvironmentalProjectCategory()).text());
        data.setSpecificLinkage(otherDetails == null ? "" : Jsoup.parse(otherDetails.getSpecificationLinkagePerspective()).text());
        data.setLandRequired("");

        setApprovalInfo2(data, currentStage);
        data.setAdminGoDate(dppGO!=null?dppGO.getRecordDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate():null);
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

    private void setTappDetailInfo(ProjectConceptResponse pcInfo, PimsProjectDetailInfoResultDTO result) {
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

        PimsApprovedProjectDetailInfoDTO data = new PimsApprovedProjectDetailInfoDTO();
        data.setPpsCode(pcInfo.getPpsCode());
        data.setProjectName(tappInfo==null?pcInfo.getTitleEn():tappInfo.getProjectTitleEn());
        data.setProjectNameBn(tappInfo==null?pcInfo.getTitleBn():tappInfo.getProjectTitleEn());
        data.setMinistryCode(agencyDTO==null?"":agencyDTO.getMinistryDivisionDTO().getCode());
        data.setAgencyCode(agencyDTO==null?"":agencyDTO.getCode());
        data.setAdpSectorCode(sector.getCode());
        data.setAdpSubSectorCode(sector.getCode()+subSector.getCode());

        setApprovalInfo2(data, currentStage);
        data.setAdminGoDate(tappGO!=null?tappGO.getRecordDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate():null);
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
        AnnualPhasingCostTotalDTO dto = new AnnualPhasingCostTotalDTO();
        dto.setTotal(annualPhasingCost.getTotalAmount());
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

    private AnnualPhasingCostTotalDTO convertTappAnnualPhasingCost(TappAnnualPhasingCostTotalDTO annualPhasingCost) {
        AnnualPhasingCostTotalDTO dto = new AnnualPhasingCostTotalDTO();
        dto.setTotal(annualPhasingCost.getTotalAmount());
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
        dto.setTotal(annualPhasingCost.getTotalAmount());
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
        dto.setTotal(dppFiscalYearDTO.getTotalAmount());
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

    private void setApprovalInfo2(PimsApprovedProjectDetailInfoDTO data, ProjectMovementStage currentStage) {
        if (currentStage!=null && currentStage.getCurrentStage().toString().contains("_")) {
            String[] text = currentStage.getCurrentStage().toString().split("_");
            if (text[0].equals("APPROVED")) {
                String[] authName = currentStage.getCurrentStage().toString().split("_BY_");
                data.setApprovalAuthority(authName[1].replace('_',' '));
                data.setDateOfApproval(currentStage.getMovementTime().toLocalDate());
            }
        }
    }

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

    private void setDppDetailInfo(ProjectConceptResponse pcInfo, ProjectDetailInfoResultDTO result, String projectCode) {
        ProjectMovementStage currentStage = null;
        DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        if (dppInfo!=null) currentStage = projectMovementService.getCurrentStageInDpp(dppInfo.getId());
        AgencyDTO agencyDTO = configClientService.getAgencyById(pcInfo.getAgencyId());
        DppTappGo dppGO = dppTappGoService.findByPcUuidAndOrderType(pcInfo.getUuid(), "GO");
        SectorDivisionDTO sectorDivision = dppInfo==null?null:configClientService.getBySectorDivisionId(pcInfo.getSectorDivisionId());
        SectorDTO sector = configClientService.getBySectorId(pcInfo.getSectorId());
        SubSectorDTO subSector = configClientService.getBySubSectorId(pcInfo.getSubSectorId());
        ResponseEntity<List<GrandTotalResponse>> grandTotalList = dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcInfo.getId());
        DetailsEstimatedCostResponse itemWiseEstimatedCost = dppAnnualPhasingCostService.getDetailsEstimatedCost(pcInfo.getUuid());

        ProjectDetailInfoDTO data = new ProjectDetailInfoDTO();
        data.setProjectCode(projectCode);
        data.setProjectName(dppInfo==null?pcInfo.getTitleEn():dppInfo.getProjectTitleEn());
        data.setProjectNameBn(dppInfo==null?pcInfo.getTitleBn():dppInfo.getProjectTitleBn());
        data.setMinistryCode(agencyDTO==null?"":agencyDTO.getMinistryDivisionDTO().getCode());
        data.setMinistryName(pcInfo.getSponsoringMinistryName());
        data.setAgencyCode(agencyDTO==null?"":agencyDTO.getCode());
        data.setAgencyName(pcInfo.getImplementingAgencyName());
        data.setSectorDivisionCode(sectorDivision==null?"":sectorDivision.getCode());
        data.setSectorDivisionName(sectorDivision==null?"":sectorDivision.getSectorDivisionNameEn());
        data.setAdpSectorCode(sector.getCode());
        data.setAdpSectorName(sector.getSectorNameEn());
        data.setAdpSubSectorCode(subSector.getCode());
        data.setAdpSubSectorName(subSector.getSubSectorNameEn());

        setApprovalInfo(data, currentStage);
        data.setGoIssueDate(dppGO!=null?dppGO.getRecordDate():null);
        data.setDateOfCommencement(dppInfo==null?pcInfo.getExpCommencementDate():dppInfo.getDateCommencement());
        data.setDateOfCompletion(dppInfo==null?pcInfo.getExpCompletionDate():dppInfo.getDateCompletion());
        data.setProjectType(pcInfo.getProjectTypeDTO().getNameEn());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy");
        data.setProjectDuration(formatter.format(pcInfo.getExpCommencementDate())+" - "+formatter.format(pcInfo.getExpCompletionDate()));
        data.setProjectObjectives(dppInfo.getObjectivesTargets());
        for (GrandTotalResponse grandTotalResponse : grandTotalList.getBody()) {
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Revenue_Component")) {
                data.setRevenue(grandTotalResponse.getDppAnnualPhasingCostTotal().get(0));
                data.setYearWiseRevenue(setYearWiseCost(grandTotalResponse.getGrandTotal()));
            }
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Capital_Component")) {
                data.setCapital(grandTotalResponse.getDppAnnualPhasingCostTotal().get(0));
                data.setYearWiseCapital(setYearWiseCost(grandTotalResponse.getGrandTotal()));
            }
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Contingency")) {
                data.setPhysicalContingency(grandTotalResponse.getDppAnnualPhasingCostTotal().get(0));
                data.setPriceContingency(grandTotalResponse.getDppAnnualPhasingCostTotal().get(1));
                List<ShortAnnualCostTotalWithFiscalYear> contingency = setYearWiseCost(grandTotalResponse.getGrandTotal());
                data.setYearWisePhysicalContingency(contingency.subList(0, contingency.size()/2));
                data.setYearWisePriceContingency(contingency.subList(contingency.size()/2, contingency.size()));
            }
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                data.setYearWiseCost(grandTotalResponse.getGrandTotal());
            }
        }

        data.setEstimatedCostRevenue(itemWiseEstimatedCost.getRevenue().getEstimatedCostTabDetailsDTOS().get(0));
        data.setEstimatedCostCapital(itemWiseEstimatedCost.getCapital().getEstimatedCostTabDetailsDTOS().get(0));
        data.setEstimatedCostPhysicalContingency(itemWiseEstimatedCost.getContingency().getEstimatedCostTabDetailsDTOS().get(0));
        data.setEstimatedCostPriceContingency(itemWiseEstimatedCost.getContingency().getEstimatedCostTabDetailsDTOS().get(1));

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

        data.setModeFinanceList(dppInfo.getModeFinanceList());
        AnnexureGoodsRequest goods = annexureGoodServiceImp.getDataByTypeAndPcId("Goods", pcInfo.getUuid());
        if (goods!=null) data.setProcurementPlanGoods(goods.getList());
        AnnexureGoodsRequest works = annexureGoodServiceImp.getDataByTypeAndPcId("Works", pcInfo.getUuid());
        if (works!=null) data.setProcurementPlanWorks(works.getList());
        AnnexureGoodsRequest service = annexureGoodServiceImp.getDataByTypeAndPcId("Service", pcInfo.getUuid());
        if (service!=null) data.setProcurementPlanService(service.getList());
        data.setLocationWiseCost(dppLocationWiseBreakdownService.getByProjectConceptMasterId(pcInfo.getId()).getBody());

        result.setStatus("success");
        result.setMessage("Project Found!");
        result.setData(data);
    }

    private void setTappDetailInfo(ProjectConceptResponse pcInfo, ProjectDetailInfoResultDTO result, String projectCode) {
        ProjectMovementStage currentStage = null;
        TappObjectiveCostDTO tappInfo = tappObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        if (tappInfo!=null) currentStage = projectMovementService.getCurrentStageInDpp(tappInfo.getId());
        AgencyDTO agencyDTO = configClientService.getAgencyById(pcInfo.getAgencyId());
        DppTappGo dppGO = dppTappGoService.findByPcUuidAndOrderType(pcInfo.getUuid(), "GO");
        SectorDivisionDTO sectorDivision = tappInfo==null?null:configClientService.getBySectorDivisionId(pcInfo.getSectorDivisionId());
        SectorDTO sector = configClientService.getBySectorId(pcInfo.getSectorId());
        SubSectorDTO subSector = configClientService.getBySubSectorId(pcInfo.getSubSectorId());
        ResponseEntity<List<GrandTotalResponseTapp>> grandTotalList = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcInfo.getId());
        DetailsEstimatedCostResponse itemWiseEstimatedCost = tappAnnualPhasingCostService.getDetailsEstimatedCost(pcInfo.getUuid());

        ProjectDetailInfoDTO data = new ProjectDetailInfoDTO();
        data.setProjectCode(projectCode);
        data.setProjectName(tappInfo==null?pcInfo.getTitleEn():tappInfo.getProjectTitleEn());
        data.setProjectNameBn(tappInfo==null?pcInfo.getTitleBn():tappInfo.getProjectTitleEn());
        data.setMinistryCode(agencyDTO==null?"":agencyDTO.getMinistryDivisionDTO().getCode());
        data.setMinistryName(pcInfo.getSponsoringMinistryName());
        data.setAgencyCode(agencyDTO==null?"":agencyDTO.getCode());
        data.setAgencyName(pcInfo.getImplementingAgencyName());
        data.setSectorDivisionCode(sectorDivision==null?"":sectorDivision.getCode());
        data.setSectorDivisionName(sectorDivision==null?"":sectorDivision.getSectorDivisionNameEn());
        data.setAdpSectorCode(sector.getCode());
        data.setAdpSectorName(sector.getSectorNameEn());
        data.setAdpSubSectorCode(subSector.getCode());
        data.setAdpSubSectorName(subSector.getSubSectorNameEn());

        setApprovalInfo(data, currentStage);
        data.setGoIssueDate(dppGO!=null?dppGO.getRecordDate():null);
        data.setDateOfCommencement(pcInfo==null?pcInfo.getExpCommencementDate():tappInfo.getDateCommencement());
        data.setDateOfCompletion(pcInfo==null?pcInfo.getExpCompletionDate():tappInfo.getDateCompletion());
        data.setProjectType(pcInfo.getProjectTypeDTO().getNameEn());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy");
        data.setProjectDuration(formatter.format(pcInfo.getExpCommencementDate())+" - "+formatter.format(pcInfo.getExpCompletionDate()));
        for (GrandTotalResponseTapp grandTotalResponse : grandTotalList.getBody()) {
            if (grandTotalResponse.getComponentName().toString().equals("Revenue_Component")) {
                TappAnnualPhasingCostTotalDTO tappRevenue = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                DppAnnualPhasingCostTotalDTO revenue = new DppAnnualPhasingCostTotalDTO();
                BeanUtils.copyProperties(tappRevenue, revenue);
                data.setRevenue(revenue);
                data.setYearWiseRevenue(setYearWiseCostForTapp(grandTotalResponse.getGrandTotal()));
            }
            if (grandTotalResponse.getComponentName().toString().equals("Capital_Component")) {
                TappAnnualPhasingCostTotalDTO tappCapital = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                DppAnnualPhasingCostTotalDTO capital = new DppAnnualPhasingCostTotalDTO();
                BeanUtils.copyProperties(tappCapital, capital);
                data.setCapital(capital);
                data.setYearWiseCapital(setYearWiseCostForTapp(grandTotalResponse.getGrandTotal()));
            }
            if (grandTotalResponse.getComponentName().toString().equals("Contingency")) {
                TappAnnualPhasingCostTotalDTO tappPhysicalContingency = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                TappAnnualPhasingCostTotalDTO tappPriceContingency = grandTotalResponse.getTappAnnualPhasingCostTotal().get(1);
                DppAnnualPhasingCostTotalDTO physicalContingency = new DppAnnualPhasingCostTotalDTO();
                BeanUtils.copyProperties(tappPhysicalContingency, physicalContingency);
                DppAnnualPhasingCostTotalDTO priceContingency = new DppAnnualPhasingCostTotalDTO();
                BeanUtils.copyProperties(tappPriceContingency, priceContingency);
                data.setPhysicalContingency(physicalContingency);
                data.setPriceContingency(priceContingency);
                List<ShortAnnualCostTotalWithFiscalYear> contingency = setYearWiseCostForTapp(grandTotalResponse.getGrandTotal());
                data.setYearWisePhysicalContingency(contingency.subList(0, contingency.size()/2));
                data.setYearWisePriceContingency(contingency.subList(contingency.size()/2, contingency.size()));
            }

            if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {
                List<TappAnnualCostTotalWithFiscalYear> grandTotal = grandTotalResponse.getGrandTotal();
                List<DppAnnualCostTotalWithFiscalYear> yearWiseCost = new ArrayList<>();
                for (int i = 0; i < grandTotal.size(); i++) {
                    DppAnnualCostTotalWithFiscalYear costFiscalYear = new DppAnnualCostTotalWithFiscalYear();
                    DppAnnualPhasingCostTotalDTO costDTO = new DppAnnualPhasingCostTotalDTO();
                    TappAnnualCostTotalWithFiscalYear cost = grandTotal.get(i);
                    BeanUtils.copyProperties(cost.getTappAnnualPhasingCostTotal(), costDTO);
                    costFiscalYear.setFiscalYear(cost.getFiscalYear());
                    costFiscalYear.setDppAnnualPhasingCostTotal(costDTO);
                    yearWiseCost.add(costFiscalYear);
                }
                data.setYearWiseCost(yearWiseCost);
            }
        }

        data.setEstimatedCostRevenue(itemWiseEstimatedCost.getRevenue().getEstimatedCostTabDetailsDTOS().get(0));
        data.setEstimatedCostCapital(itemWiseEstimatedCost.getCapital().getEstimatedCostTabDetailsDTOS().get(0));
        data.setEstimatedCostPhysicalContingency(itemWiseEstimatedCost.getContingency().getEstimatedCostTabDetailsDTOS().get(0));
        data.setEstimatedCostPriceContingency(itemWiseEstimatedCost.getContingency().getEstimatedCostTabDetailsDTOS().get(1));
        Optional<TappModeOfFinancing> tappModeOfFinancing = tappModeOnFinanceRepository.findByTappObjectiveCostIdAndIsDeleted(tappInfo.getId(), false);
        if (tappModeOfFinancing.isPresent()) {
            TappModeOfFinancing modeOfFinancing = tappModeOfFinancing.get();
            TappModeFinancingDTO tappModeFinancingDTO = new TappModeFinancingDTO();
            BeanUtils.copyProperties(modeOfFinancing, tappModeFinancingDTO);
            data.setTappModeFinance(tappModeFinancingDTO);
        }

        TappAnnexureGoodsRequest tappGoods = tappAnnexureGoodServiceImp.getDataByTypeAndPcId("Tapp-Goods", pcInfo.getUuid(), false);
        if (tappGoods!=null) data.setProcurementPlanTappGoods(tappGoods.getList());
        TappAnnexureGoodsRequest tappService = tappAnnexureGoodServiceImp.getDataByTypeAndPcId("Tapp-Service", pcInfo.getUuid(), false);
        if (tappService!=null) data.setProcurementPlanTappService(tappService.getList());

        result.setStatus("success");
        result.setMessage("Project Found!");
        result.setData(data);
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

    private void setApprovalInfo(ProjectDetailInfoDTO data, ProjectMovementStage currentStage) {
        if (currentStage!=null && currentStage.getCurrentStage().toString().contains("_")) {
            String[] text = currentStage.getCurrentStage().toString().split("_");
            if (text[0].equals("APPROVED")) {
                String[] authName = currentStage.getCurrentStage().toString().split("_BY_");
                data.setApprovalAuthorityName(authName[1].replace('_',' '));
                data.setDateOfApproval(currentStage.getMovementTime());
            }
        }
    }

    @Override
    public ResponseStatusDTO ePimsApprovalProjectAcknowledgement(PpsCodeEpimsCodeDTO request) {
        if (request.getPimsCode() == null || request.getPimsCode().isEmpty()) {
            return new ResponseStatusDTO("fail", "e-PIMS code is empty!");
        } else if (request.getProjectType().equals("DPP") || request.getProjectType().equals("TAPP")) {
            ProjectConceptResponse pcInfo = projectConceptClientService.updateEpimsCodeByPpsCode(request);
            if (pcInfo != null) {
                return new ResponseStatusDTO("success", "Successfully project acknowledged with e-PIMS");
            }
        }
        return new ResponseStatusDTO("fail", "Project not found");
    }
}

