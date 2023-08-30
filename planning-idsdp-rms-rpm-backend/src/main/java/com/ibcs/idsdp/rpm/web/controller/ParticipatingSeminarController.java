package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarParticipating;
import com.ibcs.idsdp.rpm.services.ParticipatingSeminarService;
import com.ibcs.idsdp.rpm.web.dto.request.ParticipatingSeminarRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ParticipatingSeminarResponseDto;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/participating-seminar")
public class ParticipatingSeminarController extends BaseController<CreateSeminarParticipating, ParticipatingSeminarRequestDto, ParticipatingSeminarResponseDto> {

   private final ParticipatingSeminarService participatingSeminarService;

    public ParticipatingSeminarController(BaseService<CreateSeminarParticipating, ParticipatingSeminarRequestDto, ParticipatingSeminarResponseDto> service, ParticipatingSeminarService participatingSeminarService) {
        super(service);
        this.participatingSeminarService = participatingSeminarService;
    }


}
