package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.QuestionTypeDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QuestionTypeService {

    Page<QuestionTypeDTO> getActiveQuestionType(PageableRequestBodyDTO pageableRequestBodyDTO);

    List<QuestionTypeDTO> getActiveQuestionTypeList();
}
