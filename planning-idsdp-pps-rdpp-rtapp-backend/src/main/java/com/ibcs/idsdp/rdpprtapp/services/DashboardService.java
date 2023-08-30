package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.rdpprtapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAnnexVVI;
import com.ibcs.idsdp.rdpprtapp.model.domain.EffectImpact;
import com.ibcs.idsdp.rdpprtapp.model.domain.FinancialAnalysis;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppAnnexVVIRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.EffectImpactRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.FinancialAnalysisRepository;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.GrandTotalResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.GrandTotalResponseTapp;

import com.ibcs.idsdp.rdpprtapp.model.domain.*;
import com.ibcs.idsdp.rdpprtapp.model.repositories.*;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
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

    public DashboardService(FinancialAnalysisRepository financialAnalysisRepository, DppAnnexVVIRepository dppAnnexVVIRepository, EffectImpactRepository effectImpactRepository, AttachmentRepository attachmentRepository, ProjectConceptClientService projectConceptClientService, DppAnnualPhasingCostService dppAnnualPhasingCostService, TappAnnualPhasingCostService tappAnnualPhasingCostService, DppProjectManagementSetupMasterRepository dppProjectManagementSetupMasterRepository, DppObjectiveCostRepository dppObjectiveCostRepository) {
        this.financialAnalysisRepository = financialAnalysisRepository;
        this.dppAnnexVVIRepository = dppAnnexVVIRepository;
        this.effectImpactRepository = effectImpactRepository;
        this.attachmentRepository = attachmentRepository;
        this.projectConceptClientService = projectConceptClientService;
        this.dppAnnualPhasingCostService = dppAnnualPhasingCostService;
        this.tappAnnualPhasingCostService = tappAnnualPhasingCostService;
        this.dppProjectManagementSetupMasterRepository = dppProjectManagementSetupMasterRepository;
        this.dppObjectiveCostRepository = dppObjectiveCostRepository;
    }

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
        }
        if (dppAnnexVVI.isPresent()) {
            DppAnnexVVI dppAnnexVVI1 = dppAnnexVVI.get();
            if (dppAnnexVVI1.getAttachmentId() != null)
                ids.add(dppAnnexVVI1.getAttachmentId().getId());
        }
        if (effectImpact.isPresent()) {
            EffectImpact effectImpact1 = effectImpact.get();
            if (effectImpact1.getEnvClearenceAttachmentId() != null)
                ids.add(effectImpact1.getId());
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
            objectiveCost.getDevelopmentPartnersList().forEach(dppCurrencyRate -> {
                attachmentList.add(attachmentRepository.findById(dppCurrencyRate.getAttachmentId()).get());
            });
        }
        return attachmentList;

    }

    public List<Attachment> getPartBAllAttachment(Long id) {
        List<Attachment> attachmentList = attachmentRepository.findAllByIdIn(getAllPartBAttachmentId(id));
        if(attachmentList.isEmpty()) {
            return null;
        } else {
            return attachmentList;
        }
    }

    public ResponseEntity<Double> getGrandTotalByProjectConceptIdList() {
        Double totalCost = 0.0;
        List<Long> pcIdList = projectConceptClientService.getProjectConceptIdListByAgency();
        if (!pcIdList.isEmpty()) {
            for (Long pcId : pcIdList) {
                List<GrandTotalResponse> dppGrandTotalResponses = dppAnnualPhasingCostService.getGrandTotalByRdppMasterId(pcId).getBody();
                if (!dppGrandTotalResponses.isEmpty() && dppGrandTotalResponses.size() > 1) {
                    List<DppAnnualPhasingCostTotalDTO> totalDTO = dppGrandTotalResponses.stream().filter(f -> f.getDppAnnualPhasing().equals(DppAnnualPhasing.Grand_Total)).map(m -> m.getDppAnnualPhasingCostTotal().get(0)).collect(Collectors.toList());
                    totalCost += totalDTO.get(0).getTotalAmount();
                    totalCost += totalDTO.get(0).getGobAmount();
                    totalCost += (totalDTO.get(0).getGobThruAmount() + totalDTO.get(0).getSpAcAmount() + totalDTO.get(0).getThruDpAmount() + totalDTO.get(0).getThruPdAmount());
                    totalCost += totalDTO.get(0).getOwnFundAmount();
                    totalCost += totalDTO.get(0).getOtherAmount();
                }

                List<GrandTotalResponseTapp> tappGrandTotalResponses = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcId).getBody();
                if (!tappGrandTotalResponses.isEmpty() && tappGrandTotalResponses.size() > 1) {
                    List<TappAnnualPhasingCostTotalDTO> totalDTO = tappGrandTotalResponses.stream().filter(f -> f.getComponentName().equals(DppAnnualPhasing.Grand_Total)).map(m -> m.getTappAnnualPhasingCostTotal().get(0)).collect(Collectors.toList());
                    totalCost += totalDTO.get(0).getTotalAmount();
                    totalCost += totalDTO.get(0).getGobAmount();
                    totalCost += (totalDTO.get(0).getGobThruAmount() + totalDTO.get(0).getSpAcAmount() + totalDTO.get(0).getThruDpAmount() + totalDTO.get(0).getThruPdAmount());
                    totalCost += totalDTO.get(0).getOwnFundAmount();
                    totalCost += totalDTO.get(0).getOtherAmount();
                }
            }
        }
        return new ResponseEntity<>(totalCost, HttpStatus.OK);
    }
}
