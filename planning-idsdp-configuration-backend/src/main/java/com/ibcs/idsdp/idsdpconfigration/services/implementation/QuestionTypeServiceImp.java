package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.QuestionType;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.QuestionTypeRepository;
import com.ibcs.idsdp.idsdpconfigration.services.QuestionTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.QuestionTypeDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class QuestionTypeServiceImp extends BaseService<QuestionType, QuestionTypeDTO> implements QuestionTypeService {

    private final QuestionTypeRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public QuestionTypeServiceImp(QuestionTypeRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    /**
     * for convertForCreate
     *
     * @param questionTypeDTO
     * @return
     */
    @Override
    protected QuestionType convertForCreate(QuestionTypeDTO questionTypeDTO) {
        QuestionType questionType = super.convertForCreate(questionTypeDTO);
        questionType.setCode(idGeneratorComponent.generateCode(questionTypeDTO.getNameEn(), repository.count()));
        return questionType;
    }

    /**
     * for convertForUpdate
     *
     * @param questionTypeDTO
     * @param questionType
     */
    @Override
    protected void convertForUpdate(QuestionTypeDTO questionTypeDTO, QuestionType questionType) {
        questionTypeDTO.setCode(questionType.getCode());
        super.convertForUpdate(questionTypeDTO, questionType);
    }

    /**
     * for get Active QuestionType
     *
     * @param requestBodyDTO
     * @return
     */
    @Override
    public Page<QuestionTypeDTO> getActiveQuestionType(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<QuestionType> ePage = repository.findAllByStatusAndIsDeleted(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    @Override
    public List<QuestionTypeDTO> getActiveQuestionTypeList() {
        List<QuestionType> questionTypes = repository.findAllByStatusAndIsDeleted(true, false);
        return this.convertForRead(questionTypes);
    }
}
