package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.TappQualificationSupportStaffConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappQualificationOfSupportStaff;
import com.ibcs.idsdp.rdpprtapp.services.TappQualificationSupportStuffService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TappQualificationSupportStuffRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.TappQualificationSupportStuffResponse;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(TappQualificationSupportStaffConstant.QUALIFICATION_SUPPORT_STUFF)
public class TappSupportStuffController extends BaseController<TappQualificationOfSupportStaff, TappQualificationSupportStuffRequest> {

    private final TappQualificationSupportStuffService stuffService;

    public TappSupportStuffController(BaseService<TappQualificationOfSupportStaff, TappQualificationSupportStuffRequest> service, TappQualificationSupportStuffService stuffService) {
        super(service);
        this.stuffService = stuffService;
    }

    // For Create Qualification Support Stuff
    @PostMapping("create234")
    public TappQualificationSupportStuffRequest createTappStuff(@RequestBody TappQualificationSupportStuffRequest tappQualificationSupportStuffRequest){
        System.out.println(tappQualificationSupportStuffRequest);
        return stuffService.createSupportStuff(tappQualificationSupportStuffRequest);
    }

    @GetMapping(path = "getSupportStuff/{pcUuid}")
    public ResponseWithResults getQualificationSupportStuff(@PathVariable String pcUuid){
        return stuffService.getQualificationSupportStuff(pcUuid);
    }

    @PutMapping("updateSupportStuff/{pcUuid}")
    public TappQualificationSupportStuffResponse update(@RequestBody TappQualificationSupportStuffResponse tappQualificationSupportStuffRequest,@PathVariable String pcUuid){

        return stuffService.updateSupportStuff(tappQualificationSupportStuffRequest, pcUuid);
    }

}
