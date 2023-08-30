package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.FsSummary;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Introduction;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.IntroductionRepository;
import com.ibcs.idsdp.feasibilitystudy.services.IntroductionService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FsSummaryDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.IntroductionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class IntroductionServiceImp extends BaseService<Introduction, IntroductionDTO> implements IntroductionService {

    private final IntroductionRepository introductionRepository;

    public IntroductionServiceImp(IntroductionRepository introductionRepository) {
        super(introductionRepository);
        this.introductionRepository = introductionRepository;
    }

    /**
     * Covert data for create
     * @param introductionDTO
     * @return
     */
    @Override
    protected Introduction convertForCreate(IntroductionDTO introductionDTO) {
        Introduction introduction = introductionRepository.findAllByFsrMasterIdAndIsDeleted(introductionDTO.getFsrMasterId(), false);
        if(introduction != null){
            introductionDTO.setUuid(introduction.getUuid());
        }
        if (introductionRepository.existsByFsrMasterIdAndIsDeleted(introductionDTO.getFsrMasterId(), false))
            super.updateEntity(introductionDTO);
        Introduction introduction1 = super.convertForCreate(introductionDTO);
        return introduction1;
    }

    /**
     * For get introduction
     * @param fsrMasterId
     */
    @Override
    public IntroductionDTO getIntroductionByFsrMasterId(Long fsrMasterId) {
        IntroductionDTO introductionDTO = new IntroductionDTO();

        Introduction introduction = introductionRepository.findAllByFsrMasterIdAndIsDeleted(fsrMasterId, false);
        if(introduction != null){
            introductionDTO.setProject_background(introduction.getProject_background());
            introductionDTO.setObj_of_fs_study(introduction.getObj_of_fs_study());
            introductionDTO.setApproach_methodology_fs_study(introduction.getApproach_methodology_fs_study());
            introductionDTO.setOrg_fs_study(introduction.getOrg_fs_study());
            introductionDTO.setUuid(introduction.getUuid());
            introductionDTO.setId(introduction.getId());
            introductionDTO.setFsrMasterId(introduction.getFsrMasterId());

            return introductionDTO;
        }

        return null;
    }
}
