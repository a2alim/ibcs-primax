package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.JustificationTypeConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.JustificationType;
import com.ibcs.idsdp.idsdpconfigration.services.JustificationTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.JustificationTypeDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(JustificationTypeConstant.justificationType)
public class JustificationTypeController extends BaseController<JustificationType, JustificationTypeDTO> {

    private final JustificationTypeService justificationTypeService;

    public JustificationTypeController(BaseService<JustificationType, JustificationTypeDTO> baseService, JustificationTypeService justificationTypeService) {
        super(baseService);
        this.justificationTypeService = justificationTypeService;
    }


    /**
     * for get Active JustificationType
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = JustificationTypeConstant.GET_ACTIVE_JUSTIFICATION_TYPE + "/{page}" + "/{size}", produces = "application/json")
    public Page<JustificationTypeDTO> getActiveJustificationType(@PathVariable("page") int page, @PathVariable("size") int size) {
        return justificationTypeService.getActiveJustificationType(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }
}