package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ScopeTaskTypeConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ScopeTaskType;
import com.ibcs.idsdp.idsdpconfigration.services.ScopeTaskTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ScopeTaskTypeDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(ScopeTaskTypeConstant.scopeTaskType)
public class ScopeTaskTypeController extends BaseController<ScopeTaskType, ScopeTaskTypeDTO> {

    private final ScopeTaskTypeService scopeTaskTypeService;

    public ScopeTaskTypeController(BaseService<ScopeTaskType, ScopeTaskTypeDTO> baseService, ScopeTaskTypeService scopeTaskTypeService) {
        super(baseService);
        this.scopeTaskTypeService = scopeTaskTypeService;
    }

    /**
     * for get Active MinistryDivision
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = ScopeTaskTypeConstant.GET_ACTIVE_SCOPE_TASK_TYPE + "/{page}" + "/{size}", produces = "application/json")
    public Page<ScopeTaskTypeDTO> getActiveMinistryDivision(@PathVariable("page") int page, @PathVariable("size") int size) {
        return scopeTaskTypeService.getActiveScopeTaskType(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }

}