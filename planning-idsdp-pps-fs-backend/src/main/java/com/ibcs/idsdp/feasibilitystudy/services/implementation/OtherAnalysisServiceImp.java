package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.OtherAnalysis;
import com.ibcs.idsdp.feasibilitystudy.model.domain.TechnicalAnalysis;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.OtherAnalysisRepository;
import com.ibcs.idsdp.feasibilitystudy.services.OtherAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.OtherAnalysisDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.TechnicalAnalysisDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class OtherAnalysisServiceImp extends BaseService<OtherAnalysis, OtherAnalysisDTO> implements OtherAnalysisService {

    private final OtherAnalysisRepository otherAnalysisRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private AttachmentUploadService attachmentUploadService;
    private final AttachmentRepository attachmentRepository;

    public OtherAnalysisServiceImp(OtherAnalysisRepository otherAnalysisRepository, IdGeneratorComponent idGeneratorComponent, AttachmentUploadService attachmentUploadService, AttachmentRepository attachmentRepository) {
        super(otherAnalysisRepository);
        this.otherAnalysisRepository = otherAnalysisRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentUploadService = attachmentUploadService;
        this.attachmentRepository = attachmentRepository;
    }

    public String createOtherAnalysis(String humanResourceAnalysis, String institutionalAnalysis, String riskSensitivityAnalysis, String alternativesAnalysis, String recommendationConclution, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            if (otherAnalysisRepository.existsByFsrMasterIdAndIsDeleted(fsrMasterId, false)) {
                Attachment attachment = null;
                if(attachmentFile != null){
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                OtherAnalysis otherAnalysis = otherAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);

                otherAnalysis.setUpdatedBy("user");
                otherAnalysis.setUpdatedOn(LocalDate.now());
                otherAnalysis.setHumanResourceAnalysis(humanResourceAnalysis);
                otherAnalysis.setInstitutionalAnalysis(institutionalAnalysis);
                otherAnalysis.setRiskSensitivityAnalysis(riskSensitivityAnalysis);
                otherAnalysis.setAlternativesAnalysis(alternativesAnalysis);
                otherAnalysis.setRecommendationConclution(recommendationConclution);
                if(attachment != null){
                    otherAnalysis.setAttachment(attachment);
                }
                otherAnalysis.setFsrMasterId(fsrMasterId);
                otherAnalysisRepository.save(otherAnalysis);
                return null;
            } else {
                String uuid = idGeneratorComponent.generateUUID();
                Attachment attachment = null;
                if (attachmentFile != null) {
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                OtherAnalysis otherAnalysis = new OtherAnalysis();

                otherAnalysis.setIsDeleted(false);
                otherAnalysis.setUuid(uuid);
                otherAnalysis.setCreatedBy("user");
                otherAnalysis.setCreatedOn(LocalDate.now());
                otherAnalysis.setHumanResourceAnalysis(humanResourceAnalysis);
                otherAnalysis.setInstitutionalAnalysis(institutionalAnalysis);
                otherAnalysis.setRiskSensitivityAnalysis(riskSensitivityAnalysis);
                otherAnalysis.setAlternativesAnalysis(alternativesAnalysis);
                otherAnalysis.setRecommendationConclution(recommendationConclution);
                if (attachment != null) {
                    otherAnalysis.setAttachment(attachment);
                }
                otherAnalysis.setFsrMasterId(fsrMasterId);
                otherAnalysisRepository.save(otherAnalysis);
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public OtherAnalysisDTO getOtherAnalysisList(Long fsrMasterId) {

        try {
            OtherAnalysis otherAnalysis = otherAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);
            if(otherAnalysis != null){
                OtherAnalysisDTO otherAnalysisDTO = new OtherAnalysisDTO();
                otherAnalysisDTO.setHumanResourceAnalysis(otherAnalysis.getHumanResourceAnalysis());
                otherAnalysisDTO.setInstitutionalAnalysis(otherAnalysis.getInstitutionalAnalysis());
                otherAnalysisDTO.setRiskSensitivityAnalysis(otherAnalysis.getRiskSensitivityAnalysis());
                otherAnalysisDTO.setAlternativesAnalysis(otherAnalysis.getAlternativesAnalysis());
                otherAnalysisDTO.setRecommendationConclution(otherAnalysis.getRecommendationConclution());
                if(otherAnalysis.getAttachment() != null) {
                    Optional<Attachment> attachmentOptional = attachmentRepository.findById(otherAnalysis.getAttachment().getId());
                    Attachment attachment = attachmentOptional.get();
                    otherAnalysisDTO.setAttachment(attachment);
                }
                otherAnalysisDTO.setId(otherAnalysis.getId());
                otherAnalysisDTO.setUuid(otherAnalysis.getUuid());
                otherAnalysisDTO.setFsrMasterId(otherAnalysis.getFsrMasterId());

                return otherAnalysisDTO;
            }
            return null;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String updateOtherAnalysis(String humanResourceAnalysis, String institutionalAnalysis, String riskSensitivityAnalysis, String alternativesAnalysis, String recommendationConclution, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            Attachment attachment = null;
            if(attachmentFile != null){
                attachment = this.attachmentUploadService.upload(attachmentFile);
            }
            OtherAnalysis otherAnalysis = otherAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);

            otherAnalysis.setUpdatedBy("user");
            otherAnalysis.setUpdatedOn(LocalDate.now());
            otherAnalysis.setHumanResourceAnalysis(humanResourceAnalysis);
            otherAnalysis.setInstitutionalAnalysis(institutionalAnalysis);
            otherAnalysis.setRiskSensitivityAnalysis(riskSensitivityAnalysis);
            otherAnalysis.setAlternativesAnalysis(alternativesAnalysis);
            otherAnalysis.setRecommendationConclution(recommendationConclution);
            otherAnalysis.setAttachment(attachment);
            otherAnalysis.setFsrMasterId(fsrMasterId);
            otherAnalysisRepository.save(otherAnalysis);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


}
