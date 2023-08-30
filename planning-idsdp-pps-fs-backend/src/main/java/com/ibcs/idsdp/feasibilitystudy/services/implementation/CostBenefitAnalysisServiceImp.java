package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.CostBenefitAnalysis;
import com.ibcs.idsdp.feasibilitystudy.model.domain.TechnicalAnalysis;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.CostBenefitAnalysisRepository;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.TechnicalAnalysisRepository;
import com.ibcs.idsdp.feasibilitystudy.services.CostBenefitAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.CostBenefitAnalysisDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.TechnicalAnalysisDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class CostBenefitAnalysisServiceImp extends BaseService<CostBenefitAnalysis, CostBenefitAnalysisDTO> implements CostBenefitAnalysisService {

    private final CostBenefitAnalysisRepository costBenefitAnalysisRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private AttachmentUploadService attachmentUploadService;
    private final AttachmentRepository attachmentRepository;

    public CostBenefitAnalysisServiceImp(CostBenefitAnalysisRepository costBenefitAnalysisRepository, IdGeneratorComponent idGeneratorComponent, AttachmentUploadService attachmentUploadService, AttachmentRepository attachmentRepository) {
        super(costBenefitAnalysisRepository);
        this.costBenefitAnalysisRepository = costBenefitAnalysisRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentUploadService = attachmentUploadService;
        this.attachmentRepository = attachmentRepository;
    }

    public String createCostBenefitAnalysis(String financialAnalysis, Double financialNetPresentVal, Double financialBenefitCostRatio, Double financialInternalRateReturn, String economicAnalysis, Double economicNetPresentVal, Double economicBenefitCostRatio, Double economicInternalRateReturn, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            if (costBenefitAnalysisRepository.existsByFsrMasterIdAndIsDeleted(fsrMasterId, false)) {
                Attachment attachment = null;
                if(attachmentFile != null){
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                CostBenefitAnalysis costBenefitAnalysis = costBenefitAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);

                costBenefitAnalysis.setUpdatedBy("user");
                costBenefitAnalysis.setUpdatedOn(LocalDate.now());
                costBenefitAnalysis.setFinancialAnalysis(financialAnalysis);
                costBenefitAnalysis.setFinancialNetPresentVal(financialNetPresentVal);
                costBenefitAnalysis.setFinancialBenefitCostRatio(financialBenefitCostRatio);
                costBenefitAnalysis.setFinancialInternalRateReturn(financialInternalRateReturn);
                costBenefitAnalysis.setEconomicAnalysis(economicAnalysis);
                costBenefitAnalysis.setEconomicNetPresentVal(economicNetPresentVal);
                costBenefitAnalysis.setEconomicBenefitCostRatio(economicBenefitCostRatio);
                costBenefitAnalysis.setEconomicInternalRateReturn(economicInternalRateReturn);
                if(attachment != null){
                    costBenefitAnalysis.setAttachment(attachment);
                }
                costBenefitAnalysis.setFsrMasterId(fsrMasterId);
                costBenefitAnalysisRepository.save(costBenefitAnalysis);
                return null;
            } else {
                String uuid = idGeneratorComponent.generateUUID();
                Attachment attachment = null;
                if (attachmentFile != null) {
                    attachment = this.attachmentUploadService.upload(attachmentFile);
                }
                CostBenefitAnalysis costBenefitAnalysis = new CostBenefitAnalysis();

                costBenefitAnalysis.setIsDeleted(false);
                costBenefitAnalysis.setUuid(uuid);
                costBenefitAnalysis.setCreatedBy("user");
                costBenefitAnalysis.setCreatedOn(LocalDate.now());
                costBenefitAnalysis.setFinancialAnalysis(financialAnalysis);
                costBenefitAnalysis.setFinancialNetPresentVal(financialNetPresentVal);
                costBenefitAnalysis.setFinancialBenefitCostRatio(financialBenefitCostRatio);
                costBenefitAnalysis.setFinancialInternalRateReturn(financialInternalRateReturn);
                costBenefitAnalysis.setEconomicAnalysis(economicAnalysis);
                costBenefitAnalysis.setEconomicNetPresentVal(economicNetPresentVal);
                costBenefitAnalysis.setEconomicBenefitCostRatio(economicBenefitCostRatio);
                costBenefitAnalysis.setEconomicInternalRateReturn(economicInternalRateReturn);
                if (attachment != null) {
                    costBenefitAnalysis.setAttachment(attachment);
                }
                costBenefitAnalysis.setFsrMasterId(fsrMasterId);
                costBenefitAnalysisRepository.save(costBenefitAnalysis);
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public CostBenefitAnalysisDTO getCostBenefitAnalysisList(Long fsrMasterId) {

        try {
            CostBenefitAnalysis costBenefitAnalysis = costBenefitAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);
            if(costBenefitAnalysis != null){
                CostBenefitAnalysisDTO costBenefitAnalysisDTO = new CostBenefitAnalysisDTO();
                costBenefitAnalysisDTO.setFinancialAnalysis(costBenefitAnalysis.getFinancialAnalysis());
                costBenefitAnalysisDTO.setFinancialNetPresentVal(costBenefitAnalysis.getFinancialNetPresentVal());
                costBenefitAnalysisDTO.setFinancialBenefitCostRatio(costBenefitAnalysis.getFinancialBenefitCostRatio());
                costBenefitAnalysisDTO.setFinancialInternalRateReturn(costBenefitAnalysis.getFinancialInternalRateReturn());
                costBenefitAnalysisDTO.setEconomicAnalysis(costBenefitAnalysis.getEconomicAnalysis());
                costBenefitAnalysisDTO.setEconomicNetPresentVal(costBenefitAnalysis.getEconomicNetPresentVal());
                costBenefitAnalysisDTO.setEconomicBenefitCostRatio(costBenefitAnalysis.getEconomicBenefitCostRatio());
                costBenefitAnalysisDTO.setEconomicInternalRateReturn(costBenefitAnalysis.getEconomicInternalRateReturn());
                if(costBenefitAnalysis.getAttachment() != null) {
                    Optional<Attachment> attachmentOptional = attachmentRepository.findById(costBenefitAnalysis.getAttachment().getId());
                    Attachment attachment = attachmentOptional.get();
                    costBenefitAnalysisDTO.setAttachment(attachment);
                }
                costBenefitAnalysisDTO.setId(costBenefitAnalysis.getId());
                costBenefitAnalysisDTO.setUuid(costBenefitAnalysis.getUuid());
                costBenefitAnalysisDTO.setFsrMasterId(costBenefitAnalysis.getFsrMasterId());

                return costBenefitAnalysisDTO;
            }
            return null;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String updateCostBenefitAnalysis(String financialAnalysis, Double financialNetPresentVal, Double financialBenefitCostRatio, Double financialInternalRateReturn, String economicAnalysis, Double economicNetPresentVal, Double economicBenefitCostRatio, Double economicInternalRateReturn, MultipartFile attachmentFile, Long fsrMasterId) {
        try {
            Attachment attachment = null;
            if(attachmentFile != null){
                attachment = this.attachmentUploadService.upload(attachmentFile);
            }
            CostBenefitAnalysis costBenefitAnalysis = costBenefitAnalysisRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId,false);

            costBenefitAnalysis.setUpdatedBy("user");
            costBenefitAnalysis.setUpdatedOn(LocalDate.now());
            costBenefitAnalysis.setFinancialAnalysis(financialAnalysis);
            costBenefitAnalysis.setFinancialNetPresentVal(financialNetPresentVal);
            costBenefitAnalysis.setFinancialBenefitCostRatio(financialBenefitCostRatio);
            costBenefitAnalysis.setFinancialInternalRateReturn(financialInternalRateReturn);
            costBenefitAnalysis.setEconomicAnalysis(economicAnalysis);
            costBenefitAnalysis.setEconomicNetPresentVal(economicNetPresentVal);
            costBenefitAnalysis.setEconomicBenefitCostRatio(economicBenefitCostRatio);
            costBenefitAnalysis.setEconomicInternalRateReturn(economicInternalRateReturn);
            costBenefitAnalysis.setAttachment(attachment);
            costBenefitAnalysis.setFsrMasterId(fsrMasterId);
            costBenefitAnalysisRepository.save(costBenefitAnalysis);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
