package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.constants.ImsModuleConstants;
import com.ibcs.idsdp.model.domain.Help;
import com.ibcs.idsdp.services.BaseService;
import com.ibcs.idsdp.services.HelpService;
import com.ibcs.idsdp.web.dto.HelpDTO;
import org.springframework.web.bind.annotation.RequestMapping;


@ApiController
@RequestMapping(ImsModuleConstants.HELP_ENDPOINT)
public class HelpController extends BaseController<Help, HelpDTO> {

    private final HelpService helpService;

    public HelpController(BaseService<Help, HelpDTO> baseService, HelpService helpService) {
        super(baseService);
        this.helpService = helpService;
    }
}
