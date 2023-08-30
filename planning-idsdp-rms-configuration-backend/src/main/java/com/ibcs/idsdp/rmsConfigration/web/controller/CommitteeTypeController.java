package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.CommitteeTypeConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;
import com.ibcs.idsdp.rmsConfigration.services.CommitteeTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CommitteeTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommitteeTypeResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;


@RestApiController
@RequestMapping(CommitteeTypeConstant.COMMITTEE_TYPE)
public class CommitteeTypeController extends BaseController<CommitteeType, CommitteeTypeRequestDto, CommitteeTypeResponseDto> {

    private final CommitteeTypeService committeeTypeService;

    public CommitteeTypeController(BaseService<CommitteeType, CommitteeTypeRequestDto, CommitteeTypeResponseDto> service, CommitteeTypeService committeeTypeService) {
        super(service);
        this.committeeTypeService = committeeTypeService;
    }


    @PostMapping(path = CommitteeTypeConstant.CREATE_COMMITTEE_TYPE, produces = "application/json")
    public Response<CommitteeTypeResponseDto> createCommitteeType(@RequestBody CommitteeTypeRequestDto committeeTypeRequestDto) {

        return committeeTypeService.createCommitteeType(committeeTypeRequestDto);
    }

    @PutMapping(path = CommitteeTypeConstant.UPDATRE_COMMITTEE_TYPE, produces = "application/json")
    public Response<CommitteeTypeResponseDto> updateCommitteeType(@RequestBody CommitteeTypeRequestDto committeeTypeRequestDto) {

        return committeeTypeService.updateCommitteeType(committeeTypeRequestDto);
    }

    @GetMapping(path = CommitteeTypeConstant.GET_ACTIVE_LIST, produces = "application/json")
    public Response<CommitteeType> findAllByActive() {
        return committeeTypeService.findAllByActive(false, true);
    }

}
