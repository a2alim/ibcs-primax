package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.constants.ImsModuleConstants;
import com.ibcs.idsdp.model.domain.Resources;
import com.ibcs.idsdp.services.BaseService;
import com.ibcs.idsdp.services.ResourcesService;
import com.ibcs.idsdp.web.dto.ResourcesDTO;
import com.ibcs.idsdp.web.dto.ResourcesFilterDTO;
import com.ibcs.idsdp.web.dto.request.ResourcesSearchDTO;
import com.ibcs.idsdp.web.dto.request.SearchWithPageableRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@ApiController
@RequestMapping(ImsModuleConstants.RESOURCES_ENDPOINT)
public class ResourcesController extends BaseController<Resources, ResourcesDTO> {

    private final ResourcesService resourcesService;

    public ResourcesController(BaseService<Resources, ResourcesDTO> baseService, ResourcesService resourcesService) {
        super(baseService);
        this.resourcesService = resourcesService;
    }

    @GetMapping(path= ImsModuleConstants.GET_ACTIVE_LIST, produces = "application/json")
    public List<ResourcesDTO> getActiveList() {
        return resourcesService.getActiveList();
    }

    @PostMapping(path= ImsModuleConstants.SEARCH_RESOURCES, produces = "application/json")
    public List<ResourcesDTO> searchResources(@RequestBody ResourcesSearchDTO searchDTO) {
        return resourcesService.searchResources(searchDTO);
    }

    @GetMapping(path= ImsModuleConstants.GET_FILTER_LIST, produces = "application/json")
    public ResourcesFilterDTO getFilterList() {
        return resourcesService.getFilterList();
    }

    @PostMapping(value = ImsModuleConstants.APPLY_PAGE_FILTER)
    public Page<Resources> applyFilter(@RequestBody SearchWithPageableRequest request) {
        return resourcesService.findAllByPageable(request);
    }



    @GetMapping(path= ImsModuleConstants.GET_YEAR_LIST_BY_CATEGORY + "/{category}", produces = "application/json")
    public List<String> getYearListByCategory(@PathVariable String category) {
        return resourcesService.getYearListByCategory(category);
    }

    @GetMapping(path= ImsModuleConstants.GET_MONTH_LIST_BY_YEAR + "/{year}", produces = "application/json")
    public List<String> getMonthListByYear(@PathVariable String year) {
        return resourcesService.getMonthListByYear(year);
    }
}
