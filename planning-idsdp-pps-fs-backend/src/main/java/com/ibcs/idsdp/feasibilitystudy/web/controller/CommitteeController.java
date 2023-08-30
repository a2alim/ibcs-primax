package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.CommitteeConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Committee;
import com.ibcs.idsdp.feasibilitystudy.services.CommitteeService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.CommitteeDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.CommitteeRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(CommitteeConstant.COMMITTEE_MANAGEMENT)
public class CommitteeController extends BaseController<Committee, CommitteeDTO> {

    private final CommitteeService committeeService;

    public CommitteeController(BaseService<Committee, CommitteeDTO> baseService, CommitteeService committeeService) {
        super(baseService);
        this.committeeService = committeeService;
    }

    @PostMapping(path = CommitteeConstant.CREATE_COMMITTEE_WITH_MEMBER, produces = "application/json")
    public CommitteeDTO createCommittee(@RequestBody CommitteeDTO committeeDTO) {
        return committeeService.createCommittee(committeeDTO);
    }

    @PostMapping(path = CommitteeConstant.COMMITTEE_LIST_BY_FSP_MASTER_ID, produces = "application/json")
    public Page<CommitteeDTO> getCommitteeListByFspMasterId(@RequestBody CommitteeRequest request) {
        return committeeService.getCommitteeListByFspMasterId(request);
    }

    @PutMapping(path = CommitteeConstant.UPDATE_COMMITTEE_WITH_MEMBER, produces = "application/json")
    public CommitteeDTO updateCommitteeWithMember(@RequestBody CommitteeDTO committeeDTO) {
        return committeeService.updateCommitteeWithMember(committeeDTO);
    }

}

