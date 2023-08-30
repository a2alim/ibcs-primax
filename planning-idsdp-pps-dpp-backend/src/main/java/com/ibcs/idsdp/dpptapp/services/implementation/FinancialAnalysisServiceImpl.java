package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.FinancialAnalysis;
import com.ibcs.idsdp.dpptapp.model.domain.FinancialAnalysisCalculation;
import com.ibcs.idsdp.dpptapp.model.domain.FinancialAnalysisCalculationDetails;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.FinancialAnalysisCalculationDtlRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.FinancialAnalysisCalculationRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.FinancialAnalysisRepository;
import com.ibcs.idsdp.dpptapp.services.FinancialAnalysisService;
import com.ibcs.idsdp.dpptapp.web.dto.FinancialAnalysisCalculationDetailsDto;
import com.ibcs.idsdp.dpptapp.web.dto.request.FinancialAnalysisCalcultionRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.FinancialAnalysisCalcultionResponse;
import com.ibcs.idsdp.dpptapp.web.dto.request.FinancialAnalysisRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional
public class FinancialAnalysisServiceImpl implements FinancialAnalysisService {
    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final DppObjectiveCostRepository masterTableRepo;
    private final AttachmentRepository attachmentRepository;
    private final FinancialAnalysisCalculationRepository financialAnalysisCalRepo;
    private final FinancialAnalysisCalculationDtlRepository financialAnalysisCalDtlRepo;

    // For Create Financial Analysis
    @Override
    public FinancialAnalysis saveFinancialAnalysis(FinancialAnalysisRequest financialAnalysisRequest) {
        String uuid = idGeneratorComponent.generateUUID();
        FinancialAnalysis financialAnalysis = new FinancialAnalysis();

        // Convert request to object
        BeanUtils.copyProperties(financialAnalysisRequest, financialAnalysis);
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
        if (financialAnalysisOptional.isPresent()) {
            FinancialAnalysis financialAnalysis = financialAnalysisOptional.get();
            return new ResponseWithResults(200, "", financialAnalysis);
        }
        return new ResponseWithResults(500, "Data Not Found", "");
    }

    public void findAttachment(FinancialAnalysis financialAnalysis, FinancialAnalysisRequest financialAnalysisRequest) {

        Attachment summaryAttachment = null;
        Attachment financialAttachment = null;
        Attachment economicAttachment = null;

        if (financialAnalysisRequest.getAttachmentSummaryId() != null) {
            Optional<Attachment> attachmentOptional = attachmentRepository.findById(financialAnalysisRequest.getAttachmentSummaryId());
            if (attachmentOptional.isPresent()) {
                summaryAttachment = attachmentOptional.get();
            }
        }

        if (financialAnalysisRequest.getFinacialAnalysisAttachmentId() != null) {
            Optional<Attachment> attachmentOptional = attachmentRepository.findById(financialAnalysisRequest.getFinacialAnalysisAttachmentId());
            if (attachmentOptional.isPresent()) {
                financialAttachment = attachmentOptional.get();
            }
        }

        if (financialAnalysisRequest.getEconomicAnalysisAttachmentId() != null) {
            Optional<Attachment> attachmentOptional = attachmentRepository.findById(financialAnalysisRequest.getEconomicAnalysisAttachmentId());
            if (attachmentOptional.isPresent()) {
                economicAttachment = attachmentOptional.get();
            }
        }

        financialAnalysis.setSummaryFindingAttachmentId(summaryAttachment);
        financialAnalysis.setFinancialAttachmentId(financialAttachment);
        financialAnalysis.setEconomicAttachmentId(economicAttachment);
    }


    @Override
    public ResponseWithResults createFinancialAnalysisCalculation(FinancialAnalysisCalcultionRequest financialAnalysisCalRequest) {

        if (financialAnalysisCalRequest == null) {
            return new ResponseWithResults(500, "Request Data Empty !", "");
        }

        FinancialAnalysisCalculation financialAnalysisCalculation = financialAnalysisCalRepo.findByUuid(financialAnalysisCalRequest.getUuid());
        if (financialAnalysisCalculation == null) {
            return saveFinancialAnalysisCalculation(financialAnalysisCalRequest);
        } else {
            return updateFinancialAnalysisCalculation(financialAnalysisCalRequest, financialAnalysisCalculation);
        }
    }

    public ResponseWithResults saveFinancialAnalysisCalculation(FinancialAnalysisCalcultionRequest financialAnalysisCalRequest) {

        FinancialAnalysisCalculation financialAnalysisCalObj = new FinancialAnalysisCalculation();
        String uuid = idGeneratorComponent.generateUUID();
        // Convert request to object
        BeanUtils.copyProperties(financialAnalysisCalRequest, financialAnalysisCalObj);

        List<FinancialAnalysisCalculationDetails> financialAnalysisList = new ArrayList<>();
        FinancialAnalysisCalculationDetails detailsObj = null;

        if (!CollectionUtils.isEmpty(financialAnalysisCalRequest.getFinancialAnalysisList())) {
            for (FinancialAnalysisCalculationDetailsDto dto : financialAnalysisCalRequest.getFinancialAnalysisList()) {
                detailsObj = new FinancialAnalysisCalculationDetails();
                BeanUtils.copyProperties(dto, detailsObj);
                detailsObj.setProjectConceptMasterId(financialAnalysisCalRequest.getProjectConceptMasterId());
                financialAnalysisList.add(detailsObj);
            }
        }

        financialAnalysisCalObj.setFinancialAnalysisList(financialAnalysisList);
        financialAnalysisCalObj.setCreatedBy("admin");
        financialAnalysisCalObj.setCreatedOn(LocalDate.now());
        financialAnalysisCalObj.setIsDeleted(false);
        financialAnalysisCalObj.setUuid(uuid);

        FinancialAnalysisCalculation financialAnalysisCalculation = financialAnalysisCalRepo.save(financialAnalysisCalObj);
        financialAnalysisCalculation.getFinancialAnalysisList().forEach(financialAnalysisCalculationDetails -> financialAnalysisCalculationDetails.setFinancialAnalysisCalculation(financialAnalysisCalculation));

        if (financialAnalysisCalculation != null) {
            FinancialAnalysisCalcultionResponse financialAnalysisCalcultionResponse = new FinancialAnalysisCalcultionResponse();
            BeanUtils.copyProperties(financialAnalysisCalculation, financialAnalysisCalcultionResponse);

            List<FinancialAnalysisCalculationDetailsDto> resFinancialAnalysisList = new ArrayList<>();
            FinancialAnalysisCalculationDetailsDto resDetailsObj = null;

            if (!CollectionUtils.isEmpty(financialAnalysisCalculation.getFinancialAnalysisList())) {
                for (FinancialAnalysisCalculationDetails entityObj : financialAnalysisCalObj.getFinancialAnalysisList()) {
                    resDetailsObj = new FinancialAnalysisCalculationDetailsDto();
                    BeanUtils.copyProperties(entityObj, resDetailsObj);
                    resFinancialAnalysisList.add(resDetailsObj);
                }
                ;
            }
            financialAnalysisCalcultionResponse.setFinancialAnalysisList(resFinancialAnalysisList);
            return new ResponseWithResults(200, "Financial Analysis Calculation Save Successfully.", financialAnalysisCalcultionResponse);
        } else {
            return new ResponseWithResults(500, "Financial Analysis Calculation Save Failed !", "");
        }
    }

    public ResponseWithResults updateFinancialAnalysisCalculation(FinancialAnalysisCalcultionRequest financialAnalysisCalRequest, FinancialAnalysisCalculation financialAnalysisCalculation) {

        List<FinancialAnalysisCalculationDetails> detailsList = financialAnalysisCalDtlRepo.findByProjectConceptMasterId(financialAnalysisCalculation.getProjectConceptMasterId());
        financialAnalysisCalDtlRepo.deleteAll(detailsList);

        BeanUtils.copyProperties(financialAnalysisCalRequest, financialAnalysisCalculation);

        List<FinancialAnalysisCalculationDetails> financialAnalysisList = new ArrayList<>();
        FinancialAnalysisCalculationDetails detailsObj = null;

        if (!CollectionUtils.isEmpty(financialAnalysisCalRequest.getFinancialAnalysisList())) {
            for (FinancialAnalysisCalculationDetailsDto dto : financialAnalysisCalRequest.getFinancialAnalysisList()) {
                detailsObj = new FinancialAnalysisCalculationDetails();
                BeanUtils.copyProperties(dto, detailsObj);
                financialAnalysisList.add(detailsObj);
            }
        }

        financialAnalysisCalculation.setFinancialAnalysisList(financialAnalysisList);
        financialAnalysisCalculation.setUpdatedOn(LocalDate.now());

        FinancialAnalysisCalculation financialAnalysisCalculationObj = financialAnalysisCalRepo.save(financialAnalysisCalculation);
        financialAnalysisCalculationObj.getFinancialAnalysisList().forEach(financialAnalysisCalculationDetails -> financialAnalysisCalculationDetails.setFinancialAnalysisCalculation(financialAnalysisCalculation));

        if (financialAnalysisCalculation != null) {
            FinancialAnalysisCalcultionResponse financialAnalysisCalcultionResponse = new FinancialAnalysisCalcultionResponse();
            BeanUtils.copyProperties(financialAnalysisCalculation, financialAnalysisCalcultionResponse);

            List<FinancialAnalysisCalculationDetailsDto> resFinancialAnalysisList = new ArrayList<>();
            FinancialAnalysisCalculationDetailsDto resDetailsObj = null;

            if (!CollectionUtils.isEmpty(financialAnalysisCalculationObj.getFinancialAnalysisList())) {
                for (FinancialAnalysisCalculationDetails entityObj : financialAnalysisCalculationObj.getFinancialAnalysisList()) {
                    resDetailsObj = new FinancialAnalysisCalculationDetailsDto();
                    BeanUtils.copyProperties(entityObj, resDetailsObj);
                    resFinancialAnalysisList.add(resDetailsObj);
                }
                ;
            }
            financialAnalysisCalcultionResponse.setFinancialAnalysisList(resFinancialAnalysisList);

            return new ResponseWithResults(200, "Financial Analysis Calculation Save Successfully.", financialAnalysisCalcultionResponse);
        } else {
            return new ResponseWithResults(500, "Financial Analysis Calculation Save Failed !", "");
        }
    }

    @Override
    public ResponseWithResults findByProjectConceptMasterIdAndCalculationType(Long projectConceptMasterId, String calculationType) {
        FinancialAnalysisCalculation financialAnalysisCalObj = financialAnalysisCalRepo.findByProjectConceptMasterIdAndCalculationType(projectConceptMasterId, calculationType);

        if (financialAnalysisCalObj != null) {
            FinancialAnalysisCalcultionResponse financialAnalysisCalcultionResponse = new FinancialAnalysisCalcultionResponse();
            BeanUtils.copyProperties(financialAnalysisCalObj, financialAnalysisCalcultionResponse);

            List<FinancialAnalysisCalculationDetailsDto> financialAnalysisList = new ArrayList<>();
            FinancialAnalysisCalculationDetailsDto detailsObj = null;

            if (!CollectionUtils.isEmpty(financialAnalysisCalObj.getFinancialAnalysisList())) {
                for (FinancialAnalysisCalculationDetails entityObj : financialAnalysisCalObj.getFinancialAnalysisList()) {
                    detailsObj = new FinancialAnalysisCalculationDetailsDto();
                    BeanUtils.copyProperties(entityObj, detailsObj);
                    financialAnalysisList.add(detailsObj);
                }
                ;
            }
            financialAnalysisCalcultionResponse.setFinancialAnalysisList(financialAnalysisList);

            return new ResponseWithResults(200, "Data Found", financialAnalysisCalcultionResponse);
        }
        return new ResponseWithResults(500, "Data Not Found", "");
    }

}
