package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.QuestionTypeConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.QuestionType;
import com.ibcs.idsdp.idsdpconfigration.services.QuestionTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.QuestionTypeDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(QuestionTypeConstant.QUESTION_TYPE)
public class QuestionTypeController extends BaseController<QuestionType, QuestionTypeDTO> {

    private final QuestionTypeService questionTypeService;

    public QuestionTypeController(BaseService<QuestionType, QuestionTypeDTO> baseService, QuestionTypeService questionTypeService) {
        super(baseService);
        this.questionTypeService = questionTypeService;
    }


    /**
     * for get Active Department list
     *
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = QuestionTypeConstant.GET_ACTIVE_QUESTION + "/{page}" + "/{size}", produces = "application/json")
    public Page<QuestionTypeDTO> getActiveQuestion(@PathVariable("page") int page, @PathVariable("size") int size) {
        return questionTypeService.getActiveQuestionType(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }

    @GetMapping(path = QuestionTypeConstant.GET_ACTIVE_QUESTION_LIST, produces = "application/json")
    public List<QuestionTypeDTO> getActiveQuestionList() {
        return questionTypeService.getActiveQuestionTypeList();
    }
}