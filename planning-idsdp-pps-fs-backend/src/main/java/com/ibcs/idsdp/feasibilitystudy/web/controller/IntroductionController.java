package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.IntroductionConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Introduction;
import com.ibcs.idsdp.feasibilitystudy.services.IntroductionService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.IntroductionDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(IntroductionConstant.INTRODUCTION)
public class IntroductionController extends BaseController<Introduction, IntroductionDTO> {

    private final IntroductionService introductionService;

    public IntroductionController(BaseService<Introduction, IntroductionDTO> baseService, IntroductionService introductionService) {
        super(baseService);
        this.introductionService = introductionService;
    }

    @GetMapping("/getIntroduction/{fsrMasterId}")
    public IntroductionDTO getIntroduction(@PathVariable Long fsrMasterId) {
        return introductionService.getIntroductionByFsrMasterId(fsrMasterId);
    }
}
