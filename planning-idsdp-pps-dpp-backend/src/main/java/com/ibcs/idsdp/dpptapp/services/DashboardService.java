package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.*;
import com.ibcs.idsdp.dpptapp.model.repositories.*;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dashboardDTO.AnnexureAmountDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.GrandTotalResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.GrandTotalResponseTapp;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class DashboardService {

    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final DppAnnexVVIRepository dppAnnexVVIRepository;
    private final EffectImpactRepository effectImpactRepository;
    private final AttachmentRepository attachmentRepository;

    private final ProjectConceptClientService projectConceptClientService;
    private final DppAnnualPhasingCostService dppAnnualPhasingCostService;
    private final TappAnnualPhasingCostService tappAnnualPhasingCostService;

    private final DppProjectManagementSetupMasterRepository dppProjectManagementSetupMasterRepository;
    private final DppObjectiveCostRepository dppObjectiveCostRepository;

    public Page<Attachment> getPartBAllAttachment(int page, int size, Long id) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Attachment> pageResult = attachmentRepository.findAllByIdIn(getAllPartBAttachmentId(id), pageRequest);
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }

    public List<Long> getAllPartBAttachmentId(Long id) {
        List<Long> ids = new ArrayList<>();
        Optional<FinancialAnalysis> financialAnalysis = financialAnalysisRepository.findByProjectConceptMasterId(id);
        Optional<DppAnnexVVI> dppAnnexVVI = dppAnnexVVIRepository.findByProjectConceptMasterId(id);
        Optional<EffectImpact> effectImpact = effectImpactRepository.findByProjectConceptMasterId(id);
        if (financialAnalysis.isPresent()) {
            FinancialAnalysis financialAnalysis1 = financialAnalysis.get();
            if (financialAnalysis1.getEconomicAttachmentId() != null)
                ids.add(financialAnalysis1.getEconomicAttachmentId().getId());
            if (financialAnalysis1.getFinancialAttachmentId() != null)
                ids.add(financialAnalysis1.getFinancialAttachmentId().getId());
            if (financialAnalysis1.getSummaryFindingAttachmentId() != null)
                ids.add(financialAnalysis1.getSummaryFindingAttachmentId().getId());
        }
        if (dppAnnexVVI.isPresent()) {
            DppAnnexVVI dppAnnexVVI1 = dppAnnexVVI.get();
            if (dppAnnexVVI1.getAttachmentId() != null)
                ids.add(dppAnnexVVI1.getAttachmentId().getId());
        }
        if (effectImpact.isPresent()) {
            EffectImpact effectImpact1 = effectImpact.get();
            if (effectImpact1.getEnvClearenceAttachmentId() != null)
                ids.add(effectImpact1.getEnvClearenceAttachmentId().getId());
        }
        return ids;
    }

    public Attachment getAllAnnexxureIIAttachmentId(Long id) {

        Attachment attachment = null;
        Optional<DppProjectManagementSetupMaster> optionalDppProjectManagementSetupMaster = dppProjectManagementSetupMasterRepository.findByProjectConceptId(id);
        if (optionalDppProjectManagementSetupMaster.isPresent()) {
            DppProjectManagementSetupMaster dppProjectManagementSetupMaster = optionalDppProjectManagementSetupMaster.get();
            Long attachmentId = dppProjectManagementSetupMaster.getAttachmentId();
            Optional<Attachment> optionalAttachment = attachmentRepository.findById(attachmentId);
            if (optionalAttachment.isPresent()) {
                attachment = optionalAttachment.get();
            }
        }
        return attachment != null ? attachment : null;
    }

    public List<Attachment> getAllPartAAttachment(Long pcId) {
        List<Attachment> attachmentList = new ArrayList<>();
        Optional<DppObjectiveCost> optionalDppObjectiveCost = dppObjectiveCostRepository.findByProjectConceptMasterIdAndIsDeleted(pcId, false);
        if (optionalDppObjectiveCost.isPresent()) {
            DppObjectiveCost objectiveCost = optionalDppObjectiveCost.get();
            try {
                if (!objectiveCost.getDevelopmentPartnersList().isEmpty()) {
                    objectiveCost.getDevelopmentPartnersList().forEach(dppCurrencyRate -> {
                        attachmentList.add(attachmentRepository.findById(dppCurrencyRate.getAttachmentId()).get());
                    });
                }
            } catch (Exception exception) {

            }


        }
        return attachmentList;

    }

    public List<Attachment> getPartBAllAttachment(Long id) {
        List<Attachment> attachmentList = attachmentRepository.findAllByIdIn(getAllPartBAttachmentId(id));
        if (attachmentList.isEmpty()) {
            return null;
        } else {
            return attachmentList;
        }
    }

    public ResponseEntity<Double> getGrandTotalByProjectConceptIdList(Long agencyId) {
        Double totalCost = 0.0;
        try {
            Set<Long> pcIdList = projectConceptClientService.getProjectConceptIdListByAgency(agencyId);
            if (pcIdList.size() > 0) {
                for (Long pcId : pcIdList) {
                    List<GrandTotalResponse> dppGrandTotalResponses = dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcId).getBody();
                    if (!dppGrandTotalResponses.isEmpty() && dppGrandTotalResponses.size() > 1) {
                        List<DppAnnualPhasingCostTotalDTO> totalDTO = dppGrandTotalResponses.stream().filter(f -> f.getDppAnnualPhasing().equals(DppAnnualPhasing.Grand_Total)).map(m -> m.getDppAnnualPhasingCostTotal().get(0)).collect(Collectors.toList());
                        totalCost += totalDTO.get(0).getTotalAmount();
                    } else {
                        List<GrandTotalResponseTapp> tappGrandTotalResponses = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcId).getBody();
                        if (!tappGrandTotalResponses.isEmpty() && tappGrandTotalResponses.size() > 1) {
                            List<TappAnnualPhasingCostTotalDTO> totalDTO = tappGrandTotalResponses.stream().filter(f -> f.getComponentName().equals(DppAnnualPhasing.Grand_Total)).map(m -> m.getTappAnnualPhasingCostTotal().get(0)).collect(Collectors.toList());
                            totalCost += totalDTO.get(0).getTotalAmount();
                        }
                    }
                }
            }
        } catch (Exception exception) {
            log.info(exception.getMessage());
        }
        return new ResponseEntity<>(totalCost, HttpStatus.OK);
    }

    public Map<Long, AnnexureAmountDTO> getGrandTotalByPcIds(Set<Long> pcIds) {
        Map<Long, AnnexureAmountDTO> annexureAmountMap = new HashMap<>();
        for (Long pcId : pcIds) {
            List<GrandTotalResponse> dppGrandTotalResponses = dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcId).getBody();
            if (!dppGrandTotalResponses.isEmpty() && dppGrandTotalResponses.size() > 1) {
                List<DppAnnualPhasingCostTotalDTO> totalDTO = dppGrandTotalResponses.stream().filter(f -> f.getDppAnnualPhasing().equals(DppAnnualPhasing.Grand_Total)).map(m -> m.getDppAnnualPhasingCostTotal().get(0)).collect(Collectors.toList());
                annexureAmountMap.put(pcId, getAllAmountDpp(totalDTO.get(0)));
            } else {
                List<GrandTotalResponseTapp> tappGrandTotalResponses = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcId).getBody();
                if (!tappGrandTotalResponses.isEmpty() && tappGrandTotalResponses.size() > 1) {
                    List<TappAnnualPhasingCostTotalDTO> totalDTO = tappGrandTotalResponses.stream().filter(f -> f.getComponentName().equals(DppAnnualPhasing.Grand_Total)).map(m -> m.getTappAnnualPhasingCostTotal().get(0)).collect(Collectors.toList());
                    annexureAmountMap.put(pcId, getAllAmountTapp(totalDTO.get(0)));
                }
            }
        }
        return annexureAmountMap;
    }

    private AnnexureAmountDTO getAllAmountTapp(TappAnnualPhasingCostTotalDTO totalDTO) {
        AnnexureAmountDTO annexureAmount = new AnnexureAmountDTO();
        annexureAmount.setGobAmount(totalDTO.getGobAmount());
        annexureAmount.setGobFeAmount(totalDTO.getGobFeAmount());
        annexureAmount.setPaAmount(totalDTO.getGobThruAmount() + totalDTO.getSpAcAmount() + totalDTO.getThruDpAmount() + totalDTO.getThruPdAmount());
        annexureAmount.setRpaAmount(totalDTO.getGobThruAmount() + totalDTO.getSpAcAmount());
        annexureAmount.setOwnFundAmount(totalDTO.getOwnFundAmount());
        annexureAmount.setOwnFundFeAmount(totalDTO.getOwnFundFeAmount());
        annexureAmount.setOtherAmount(totalDTO.getOtherAmount());
        annexureAmount.setOtherFeAmount(totalDTO.getOtherFeAmount());
        annexureAmount.setTotalAmount(totalDTO.getTotalAmount());
        return annexureAmount;
    }

    private AnnexureAmountDTO getAllAmountDpp(DppAnnualPhasingCostTotalDTO totalDTO) {
        AnnexureAmountDTO annexureAmount = new AnnexureAmountDTO();
        annexureAmount.setGobAmount(totalDTO.getGobAmount());
        annexureAmount.setGobFeAmount(totalDTO.getGobFeAmount());
        annexureAmount.setPaAmount(totalDTO.getGobThruAmount() + totalDTO.getSpAcAmount() + totalDTO.getThruDpAmount() + totalDTO.getThruPdAmount());
        annexureAmount.setRpaAmount(totalDTO.getGobThruAmount() + totalDTO.getSpAcAmount());
        annexureAmount.setOwnFundAmount(totalDTO.getOwnFundAmount());
        annexureAmount.setOwnFundFeAmount(totalDTO.getOwnFundFeAmount());
        annexureAmount.setOtherAmount(totalDTO.getOtherAmount());
        annexureAmount.setOtherFeAmount(totalDTO.getOtherFeAmount());
        annexureAmount.setTotalAmount(totalDTO.getTotalAmount());
        return annexureAmount;
    }
}
