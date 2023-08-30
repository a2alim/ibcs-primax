package com.ibcs.idsdp.rdpprtapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.FinancialAnalysis;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.FinancialAnalysisRepository;
import com.ibcs.idsdp.rdpprtapp.services.FinancialAnalysisService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.FinancialAnalysisRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional
public class FinancialAnalysisServiceImpl implements FinancialAnalysisService {
    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final DppObjectiveCostRepository masterTableRepo;
    private final AttachmentRepository attachmentRepository;

    // For Create Financial Analysis
    @Override
    public FinancialAnalysis saveFinancialAnalysis(FinancialAnalysisRequest financialAnalysisRequest) {
        String uuid = idGeneratorComponent.generateUUID();
        FinancialAnalysis financialAnalysis = new FinancialAnalysis();

        // Convert request to object
        BeanUtils.copyProperties(financialAnalysisRequest,financialAnalysis);
        // One to one Relation for Proejct Details Part B to Financial Analysis
        financialAnalysis.setObjectiveCost(masterTableRepo.findByProjectConceptUuid(financialAnalysisRequest.getProjectConceptUuid()));

        findAttachment(financialAnalysis, financialAnalysisRequest);

        financialAnalysis.setCreatedBy("admin");
        financialAnalysis.setCreatedOn(LocalDate.now());
        financialAnalysis.setIsDeleted(false);
        financialAnalysis.setUuid(uuid);
        financialAnalysisRepository.save(financialAnalysis);

        return financialAnalysis;
    }

    @Override
    public FinancialAnalysis updateFinancialAnalysis(FinancialAnalysisRequest request, String pcUuid) {
       //  get effect and impact by project id
        Optional<FinancialAnalysis> analysis = financialAnalysisRepository.findByProjectConceptUuid(pcUuid);
        if (!analysis.isPresent()) {
            throw new RuntimeException("FinancialAnalysis data Not Found");
        }
        FinancialAnalysis financialAnalysis = analysis.get();

        findAttachment(financialAnalysis, request);

        // Convert request to object
        BeanUtils.copyProperties(request, financialAnalysis);

        financialAnalysis.setUpdatedOn(LocalDate.now());


        financialAnalysisRepository.save(financialAnalysis);
        return financialAnalysis;
    }

    @Override
    public ResponseWithResults getFinancialAnalysisByProjectId(String projectId) {
        Optional<FinancialAnalysis> financialAnalysisOptional = financialAnalysisRepository.findByProjectConceptUuid(projectId);
        if(financialAnalysisOptional.isPresent()) {
            FinancialAnalysis financialAnalysis = financialAnalysisOptional.get();
            return new ResponseWithResults(200, "", financialAnalysis);
        }
        return new ResponseWithResults(500, "Data Not Found", "");
    }

    public void findAttachment(FinancialAnalysis financialAnalysis, FinancialAnalysisRequest financialAnalysisRequest) {

        Attachment summaryAttachment = null;
        Attachment financialAttachment = null;
        Attachment economicAttachment = null;

        if(financialAnalysisRequest.getFinancialAnalysisAttachmentId() != null) {
            Optional<Attachment> attachmentOptional = attachmentRepository.findById(financialAnalysisRequest.getFinancialAnalysisAttachmentId());
            if (attachmentOptional.isPresent()) {
                financialAttachment = attachmentOptional.get();
            }
        }

        if(financialAnalysisRequest.getEconomicAnalysisAttachmentId() != null) {
            Optional<Attachment> attachmentOptional = attachmentRepository.findById(financialAnalysisRequest.getEconomicAnalysisAttachmentId());
            if (attachmentOptional.isPresent()) {
                economicAttachment = attachmentOptional.get();
            }
        }

        financialAnalysis.setFinancialAttachmentId(financialAttachment);
        financialAnalysis.setEconomicAttachmentId(economicAttachment);
    }
}
