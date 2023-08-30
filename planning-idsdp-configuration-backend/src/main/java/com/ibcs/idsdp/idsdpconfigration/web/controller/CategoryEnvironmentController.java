package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.CategoryEnvironmentConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.CategoryPerEnvironmentConservationRules;
import com.ibcs.idsdp.idsdpconfigration.services.CategoryEnvironmentService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.CategoryPerEnvironmentConservationRulesDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(CategoryEnvironmentConstant.CATEGORY)
public class CategoryEnvironmentController extends BaseController<CategoryPerEnvironmentConservationRules, CategoryPerEnvironmentConservationRulesDTO> {

    private final CategoryEnvironmentService categoryEnvironmentService;

    public CategoryEnvironmentController(BaseService<CategoryPerEnvironmentConservationRules, CategoryPerEnvironmentConservationRulesDTO> baseService, CategoryEnvironmentService categoryEnvironmentService) {
        super(baseService);
        this.categoryEnvironmentService = categoryEnvironmentService;
    }


    /**
     * for get Active Department list
     *
     * @return
     */
    @GetMapping(path = CategoryEnvironmentConstant.GET_ACTIVE_CATEGORY, produces = "application/json")
    public List<CategoryPerEnvironmentConservationRulesDTO> getActiveCategory() {
        return categoryEnvironmentService.getAllActiveCategoryEnvironmentList();
    }

}