package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.MarketAnalysis;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.MarketAnalysisRepository;
import com.ibcs.idsdp.feasibilitystudy.services.MarketAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.MarketAnalysisDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class MarketAnalysisServiceImp extends BaseService<MarketAnalysis, MarketAnalysisDTO> implements MarketAnalysisService {

    private final MarketAnalysisRepository marketAnalysisRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private AttachmentUploadService attachmentUploadService;
    private final AttachmentRepository attachmentRepository;

    public MarketAnalysisServiceImp(MarketAnalysisRepository marketAnalysisRepository, IdGeneratorComponent idGeneratorComponent, AttachmentUploadService attachmentUploadService, AttachmentRepository attachmentRepository) {
        super(marketAnalysisRepository);
        this.marketAnalysisRepository = marketAnalysisRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentUploadService = attachmentUploadService;
        this.attachmentRepository = attachmentRepository;
    }


    public String createMarketAnalysis(String prbStatement, String relevanceProjectIdea, String proposedProjectInterventions, String stakeholders, String currentDemand, String futureDemand, String variousDemand, String swotAnalysis, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            if (marketAnalysisRepository.existsByFsrMasterIdAndIsDeleted(fsrMasterId, false)) {
                Attachment attachment = null;
                if(attachmentFile != null){
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                MarketAnalysis marketAnalysis = marketAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);

                marketAnalysis.setUpdatedBy("user");
                marketAnalysis.setUpdatedOn(LocalDate.now());
                marketAnalysis.setPrbStatement(prbStatement);
                marketAnalysis.setRelevanceProjectIdea(relevanceProjectIdea);
                marketAnalysis.setProposedProjectInterventions(proposedProjectInterventions);
                marketAnalysis.setStakeholders(stakeholders);
                marketAnalysis.setCurrentDemand(currentDemand);
                marketAnalysis.setFutureDemand(futureDemand);
                marketAnalysis.setVariousDemand(variousDemand);
                marketAnalysis.setSwotAnalysis(swotAnalysis);
                if(attachment != null){
                    marketAnalysis.setAttachment(attachment);
                }
                marketAnalysis.setFsrMasterId(fsrMasterId);
                marketAnalysisRepository.save(marketAnalysis);
                return null;
            } else {
                String uuid = idGeneratorComponent.generateUUID();
                Attachment attachment = null;
                if (attachmentFile != null) {
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                MarketAnalysis marketAnalysis = new MarketAnalysis();

                marketAnalysis.setIsDeleted(false);
                marketAnalysis.setUuid(uuid);
                marketAnalysis.setCreatedBy("user");
                marketAnalysis.setCreatedOn(LocalDate.now());
                marketAnalysis.setPrbStatement(prbStatement);
                marketAnalysis.setRelevanceProjectIdea(relevanceProjectIdea);
                marketAnalysis.setProposedProjectInterventions(proposedProjectInterventions);
                marketAnalysis.setStakeholders(stakeholders);
                marketAnalysis.setCurrentDemand(currentDemand);
                marketAnalysis.setFutureDemand(futureDemand);
                marketAnalysis.setVariousDemand(variousDemand);
                marketAnalysis.setSwotAnalysis(swotAnalysis);
                if (attachment != null) {
                    marketAnalysis.setAttachment(attachment);
                }
                marketAnalysis.setFsrMasterId(fsrMasterId);
                marketAnalysisRepository.save(marketAnalysis);
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public MarketAnalysisDTO getMarketAnalysisList(Long fsrMasterId) {

        try {
            MarketAnalysis marketAnalysis = marketAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);
            if(marketAnalysis != null){
                MarketAnalysisDTO marketAnalysisDTO = new MarketAnalysisDTO();
                marketAnalysisDTO.setPrbStatement(marketAnalysis.getPrbStatement());
                marketAnalysisDTO.setRelevanceProjectIdea(marketAnalysis.getRelevanceProjectIdea());
                marketAnalysisDTO.setProposedProjectInterventions(marketAnalysis.getProposedProjectInterventions());
                marketAnalysisDTO.setStakeholders(marketAnalysis.getStakeholders());
                marketAnalysisDTO.setCurrentDemand(marketAnalysis.getCurrentDemand());
                marketAnalysisDTO.setFutureDemand(marketAnalysis.getFutureDemand());
                marketAnalysisDTO.setVariousDemand(marketAnalysis.getVariousDemand());
                marketAnalysisDTO.setSwotAnalysis(marketAnalysis.getSwotAnalysis());
                if(marketAnalysis.getAttachment() != null) {
                    Optional<Attachment> attachmentOptional = attachmentRepository.findById(marketAnalysis.getAttachment().getId());
                    Attachment attachment = attachmentOptional.get();
                    marketAnalysisDTO.setAttachment(attachment);
                }
                marketAnalysisDTO.setId(marketAnalysis.getId());
                marketAnalysisDTO.setUuid(marketAnalysis.getUuid());
                marketAnalysisDTO.setFsrMasterId(marketAnalysis.getFsrMasterId());

                return marketAnalysisDTO;
            }

            return null;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String updateMarketAnalysis(String prbStatement, String relevanceProjectIdea, String proposedProjectInterventions, String stakeholders, String currentDemand, String futureDemand, String variousDemand, String swotAnalysis, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            Attachment attachment = null;
            if(attachmentFile != null){
                attachment = this.attachmentUploadService.upload(attachmentFile);
            }
            MarketAnalysis marketAnalysis = marketAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);

            marketAnalysis.setUpdatedBy("user");
            marketAnalysis.setUpdatedOn(LocalDate.now());
            marketAnalysis.setPrbStatement(prbStatement);
            marketAnalysis.setRelevanceProjectIdea(relevanceProjectIdea);
            marketAnalysis.setProposedProjectInterventions(proposedProjectInterventions);
            marketAnalysis.setStakeholders(stakeholders);
            marketAnalysis.setCurrentDemand(currentDemand);
            marketAnalysis.setFutureDemand(futureDemand);
            marketAnalysis.setVariousDemand(variousDemand);
            marketAnalysis.setSwotAnalysis(swotAnalysis);
            marketAnalysis.setAttachment(attachment);
            marketAnalysis.setFsrMasterId(fsrMasterId);
            marketAnalysisRepository.save(marketAnalysis);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
