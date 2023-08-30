package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.DepartmentConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Department;
import com.ibcs.idsdp.idsdpconfigration.services.DepartmentService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.DepartmentDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(DepartmentConstant.DEPARTMENT)
public class DepartmentController extends BaseController<Department, DepartmentDTO> {

    private final DepartmentService departmentService;

    public DepartmentController(BaseService<Department, DepartmentDTO> baseService, DepartmentService departmentService) {
        super(baseService);
        this.departmentService = departmentService;
    }


    /**
     * for get Active Department list
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = DepartmentConstant.GET_ACTIVE_DEPARTMENT + "/{page}" + "/{size}", produces = "application/json")
    public Page<DepartmentDTO> getActiveDepartment(@PathVariable("page") int page, @PathVariable("size") int size) {
        return departmentService.getActiveDepartment(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }
}