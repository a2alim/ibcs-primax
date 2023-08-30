package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.RiskAnalysis;
import com.ibcs.idsdp.feasibilitystudy.model.domain.TechnicalAnalysis;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.RiskAnalysisRepository;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.TechnicalAnalysisRepository;
import com.ibcs.idsdp.feasibilitystudy.services.RiskAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.RiskAnalysisDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.TechnicalAnalysisDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class RiskAnalysisServiceImp extends BaseService<RiskAnalysis, RiskAnalysisDTO> implements RiskAnalysisService {

    private final RiskAnalysisRepository riskAnalysisRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private AttachmentUploadService attachmentUploadService;
    private final AttachmentRepository attachmentRepository;

    public RiskAnalysisServiceImp(RiskAnalysisRepository riskAnalysisRepository, IdGeneratorComponent idGeneratorComponent, AttachmentUploadService attachmentUploadService, AttachmentRepository attachmentRepository) {
        super(riskAnalysisRepository);
        this.riskAnalysisRepository = riskAnalysisRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentUploadService = attachmentUploadService;
        this.attachmentRepository = attachmentRepository;
    }

    public String createRiskAnalysis(String envClimateChangeAnalysis, String assessmentDisasterResilienceProject, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            if (riskAnalysisRepository.existsByFsrMasterIdAndIsDeleted(fsrMasterId, false)) {
                Attachment attachment = null;
                if (attachmentFile != null) {
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                RiskAnalysis riskAnalysis = riskAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId, false);

                riskAnalysis.setUpdatedBy("user");
                riskAnalysis.setUpdatedOn(LocalDate.now());
                riskAnalysis.setEnvClimateChangeAnalysis(envClimateChangeAnalysis);
                riskAnalysis.setAssessmentDisasterResilienceProject(assessmentDisasterResilienceProject);
                riskAnalysis.setAttachment(attachment);
                riskAnalysis.setFsrMasterId(fsrMasterId);
                riskAnalysisRepository.save(riskAnalysis);
                return null;
            } else {
                String uuid = idGeneratorComponent.generateUUID();
                Attachment attachment = null;
                if (attachmentFile != null) {
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                RiskAnalysis riskAnalysis = new RiskAnalysis();

                riskAnalysis.setIsDeleted(false);
                riskAnalysis.setUuid(uuid);
                riskAnalysis.setCreatedBy("user");
                riskAnalysis.setCreatedOn(LocalDate.now());
                riskAnalysis.setEnvClimateChangeAnalysis(envClimateChangeAnalysis);
                riskAnalysis.setAssessmentDisasterResilienceProject(assessmentDisasterResilienceProject);
                if (attachment != null) {
                    riskAnalysis.setAttachment(attachment);
                }
                riskAnalysis.setFsrMasterId(fsrMasterId);
                riskAnalysisRepository.save(riskAnalysis);
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public RiskAnalysisDTO getRiskAnalysisList(Long fsrMasterId) {

        try {
            RiskAnalysis riskAnalysis = riskAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId, false);
            if (riskAnalysis != null) {
                RiskAnalysisDTO riskAnalysisDTO = new RiskAnalysisDTO();
                riskAnalysisDTO.setEnvClimateChangeAnalysis(riskAnalysis.getEnvClimateChangeAnalysis());
                riskAnalysisDTO.setAssessmentDisasterResilienceProject(riskAnalysis.getAssessmentDisasterResilienceProject());
                if (riskAnalysis.getAttachment() != null) {
                    Optional<Attachment> attachmentOptional = attachmentRepository.findById(riskAnalysis.getAttachment().getId());
                    Attachment attachment = attachmentOptional.get();
                    riskAnalysisDTO.setAttachment(attachment);
                }
                riskAnalysisDTO.setId(riskAnalysis.getId());
                riskAnalysisDTO.setUuid(riskAnalysis.getUuid());
                riskAnalysisDTO.setFsrMasterId(riskAnalysis.getFsrMasterId());

                return riskAnalysisDTO;
            }

            return null;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String updateRiskAnalysis(String envClimateChangeAnalysis, String assessmentDisasterResilienceProject, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            Attachment attachment = null;
            if (attachmentFile != null) {
                attachment = this.attachmentUploadService.upload(attachmentFile);
            }
            RiskAnalysis riskAnalysis = riskAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId, false);

            riskAnalysis.setUpdatedBy("user");
            riskAnalysis.setUpdatedOn(LocalDate.now());
            riskAnalysis.setEnvClimateChangeAnalysis(envClimateChangeAnalysis);
            riskAnalysis.setAssessmentDisasterResilienceProject(assessmentDisasterResilienceProject);
            riskAnalysis.setAttachment(attachment);
            riskAnalysis.setFsrMasterId(fsrMasterId);
            riskAnalysisRepository.save(riskAnalysis);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
