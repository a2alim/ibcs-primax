package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.JustificationType;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.JustificationTypeRepository;
import com.ibcs.idsdp.idsdpconfigration.services.JustificationTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.JustificationTypeDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class JustificationTypeServiceImp extends BaseService<JustificationType, JustificationTypeDTO> implements JustificationTypeService {

    private final JustificationTypeRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public JustificationTypeServiceImp(JustificationTypeRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    /**
     * for convertForCreate
     * @param justificationTypeDTO
     * @return
     */
    @Override
    protected JustificationType convertForCreate(JustificationTypeDTO justificationTypeDTO) {
        JustificationType justificationType = super.convertForCreate(justificationTypeDTO);
        justificationType.setCode(idGeneratorComponent.generateCode(justificationTypeDTO.getNameEn(), repository.count()));
        return justificationType;
    }

    /**
     * for convertForUpdate
     * @param justificationTypeDTO
     * @param justificationType
     */
    @Override
    protected void convertForUpdate(JustificationTypeDTO justificationTypeDTO, JustificationType justificationType) {
        justificationTypeDTO.setCode(justificationType.getCode());
        super.convertForUpdate(justificationTypeDTO, justificationType);
    }

    /**
     * for get Active JustificationType
     * @param requestBodyDTO
     * @return
     */
    @Override
    public Page<JustificationTypeDTO> getActiveJustificationType(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<JustificationType> ePage = repository.findAllByStatusAndIsDeleted(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }
}


