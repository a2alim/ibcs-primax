package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.TechnicalAnalysis;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.TechnicalAnalysisRepository;
import com.ibcs.idsdp.feasibilitystudy.services.TechnicalAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.TechnicalAnalysisDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class TechnicalAnalysisServiceImp extends BaseService<TechnicalAnalysis, TechnicalAnalysisDTO> implements TechnicalAnalysisService {

    private final TechnicalAnalysisRepository technicalAnalysisRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private AttachmentUploadService attachmentUploadService;
    private final AttachmentRepository attachmentRepository;

    public TechnicalAnalysisServiceImp(TechnicalAnalysisRepository technicalAnalysisRepository, IdGeneratorComponent idGeneratorComponent, AttachmentUploadService attachmentUploadService, AttachmentRepository attachmentRepository) {
        super(technicalAnalysisRepository);
        this.technicalAnalysisRepository = technicalAnalysisRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentUploadService = attachmentUploadService;
        this.attachmentRepository = attachmentRepository;
    }

    public String createTechnicalAnalysis(String location, String technicalDesign, String outputPlan, String costEstimates, String impTimeline, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            if (technicalAnalysisRepository.existsByFsrMasterIdAndIsDeleted(fsrMasterId, false)) {
                Attachment attachment = null;
                if(attachmentFile != null){
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                TechnicalAnalysis technicalAnalysis = technicalAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);

                technicalAnalysis.setUpdatedBy("user");
                technicalAnalysis.setUpdatedOn(LocalDate.now());
                technicalAnalysis.setLocation(location);
                technicalAnalysis.setTechnicalDesign(technicalDesign);
                technicalAnalysis.setOutputPlan(outputPlan);
                technicalAnalysis.setCostEstimates(costEstimates);
                technicalAnalysis.setImpTimeline(impTimeline);
                if(attachment != null) {
                    technicalAnalysis.setAttachment(attachment);
                }
                technicalAnalysis.setFsrMasterId(fsrMasterId);
                technicalAnalysisRepository.save(technicalAnalysis);
                return null;
            } else {
                String uuid = idGeneratorComponent.generateUUID();
                Attachment attachment = null;
                if (attachmentFile != null) {
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                TechnicalAnalysis technicalAnalysis = new TechnicalAnalysis();

                technicalAnalysis.setIsDeleted(false);
                technicalAnalysis.setUuid(uuid);
                technicalAnalysis.setCreatedBy("user");
                technicalAnalysis.setCreatedOn(LocalDate.now());
                technicalAnalysis.setLocation(location);
                technicalAnalysis.setTechnicalDesign(technicalDesign);
                technicalAnalysis.setOutputPlan(outputPlan);
                technicalAnalysis.setCostEstimates(costEstimates);
                technicalAnalysis.setImpTimeline(impTimeline);
                if (attachment != null) {
                    technicalAnalysis.setAttachment(attachment);
                }
                technicalAnalysis.setFsrMasterId(fsrMasterId);
                technicalAnalysisRepository.save(technicalAnalysis);
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public TechnicalAnalysisDTO getTechnicalAnalysisList(Long fsrMasterId) {

        try {
            TechnicalAnalysis technicalAnalysis = technicalAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);
            if(technicalAnalysis != null){
                TechnicalAnalysisDTO technicalAnalysisDTO = new TechnicalAnalysisDTO();
                technicalAnalysisDTO.setLocation(technicalAnalysis.getLocation());
                technicalAnalysisDTO.setTechnicalDesign(technicalAnalysis.getTechnicalDesign());
                technicalAnalysisDTO.setOutputPlan(technicalAnalysis.getOutputPlan());
                technicalAnalysisDTO.setCostEstimates(technicalAnalysis.getCostEstimates());
                technicalAnalysisDTO.setImpTimeline(technicalAnalysis.getImpTimeline());
                if(technicalAnalysis.getAttachment() != null) {
                    Optional<Attachment> attachmentOptional = attachmentRepository.findById(technicalAnalysis.getAttachment().getId());
                    Attachment attachment = attachmentOptional.get();
                    technicalAnalysisDTO.setAttachment(attachment);
                }
                technicalAnalysisDTO.setId(technicalAnalysis.getId());
                technicalAnalysisDTO.setUuid(technicalAnalysis.getUuid());
                technicalAnalysisDTO.setFsrMasterId(technicalAnalysis.getFsrMasterId());

                return technicalAnalysisDTO;
            }
            return null;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String updateTechnicalAnalysis(String location, String technicalDesign, String outputPlan, String costEstimates, String impTimeline, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            Attachment attachment = null;
            if(attachmentFile != null){
                attachment = this.attachmentUploadService.upload(attachmentFile);
            }
            TechnicalAnalysis technicalAnalysis = technicalAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);

            technicalAnalysis.setUpdatedBy("user");
            technicalAnalysis.setUpdatedOn(LocalDate.now());
            technicalAnalysis.setLocation(location);
            technicalAnalysis.setTechnicalDesign(technicalDesign);
            technicalAnalysis.setOutputPlan(outputPlan);
            technicalAnalysis.setCostEstimates(costEstimates);
            technicalAnalysis.setImpTimeline(impTimeline);
            technicalAnalysis.setAttachment(attachment);
            technicalAnalysis.setFsrMasterId(fsrMasterId);
            technicalAnalysisRepository.save(technicalAnalysis);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
