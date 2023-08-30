package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.PASourceConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.PASource;
import com.ibcs.idsdp.idsdpconfigration.services.PASourceService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.PASourceRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.PASourceResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(PASourceConstant.paSource)
public class PASourceController extends BaseController<PASource, PASourceRequest> {

    private final PASourceService paSourceService;

    public PASourceController(BaseService<PASource, PASourceRequest> service, PASourceService paSourceService) {
        super(service);
        this.paSourceService = paSourceService;
    }

    @GetMapping(path = PASourceConstant.GET_ACTIVE_PA_SOURCE)
    public ResponseEntity<List<PASourceResponse>> getActivePaSource(){
        return paSourceService.getActivePaSource();
    }

    @Override
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public PASourceRequest create(@RequestBody PASourceRequest paSourceRequest) {
        paSourceRequest.setCode(paSourceService.generatePaSourceCode(paSourceRequest.getNameEn()));
        return super.create(paSourceRequest);
    }
}
