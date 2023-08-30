package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.constants.ImsModuleConstants;
import com.ibcs.idsdp.model.domain.Guideline;
import com.ibcs.idsdp.model.domain.ImsModule;
import com.ibcs.idsdp.services.BaseService;
import com.ibcs.idsdp.services.GuidelineService;
import com.ibcs.idsdp.web.dto.GuidelineDTO;
import com.ibcs.idsdp.web.dto.request.ImsSearchDTO;
import com.ibcs.idsdp.web.dto.request.SearchWithPageableRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@ApiController
@RequestMapping(ImsModuleConstants.GUIDELINE_ENDPOINT)
public class GuidelineController extends BaseController<Guideline, GuidelineDTO> {

    private final GuidelineService guidelineService;

    public GuidelineController(BaseService<Guideline, GuidelineDTO> baseService, GuidelineService guidelineService) {
        super(baseService);
        this.guidelineService = guidelineService;
    }

    @PostMapping(path= ImsModuleConstants.GET_ACTIVE_LIST_BY_MODULE_ID, produces = "application/json")
    public List<GuidelineDTO> getActiveListByModuleId(@RequestBody ImsSearchDTO searchDTO) {
        return guidelineService.getActiveListByModuleId(searchDTO);
    }

    @PostMapping(value = ImsModuleConstants.APPLY_PAGE_FILTER)
    public Page<Guideline> applyFilter(@RequestBody SearchWithPageableRequest request) {
        return guidelineService.findAllByPageable(request);
    }

}
