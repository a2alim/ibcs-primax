package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.TappTermOfReferenceConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappTermOfReference;
import com.ibcs.idsdp.rdpprtapp.services.TappTermOfReferenceService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TappTermOfReferenceRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(TappTermOfReferenceConstant.TAPP_TAPP_TERM_OF_REFERENCE)

public class TappTermOfReferenceController extends BaseController<TappTermOfReference, TappTermOfReferenceRequest> {

    private TappTermOfReferenceService referenceService;

    public TappTermOfReferenceController(BaseService<TappTermOfReference, TappTermOfReferenceRequest> service, TappTermOfReferenceService referenceService) {
        super(service);
        this.referenceService = referenceService;
    }

//    @Override
//    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
//    public TappTermOfReferenceRequest create(@RequestBody TappTermOfReferenceRequest termOfReferenceRequest) {
//
//        return super.create(termOfReferenceRequest);
//    }

    @GetMapping(path = TappTermOfReferenceConstant.GET_REFERENCE + "/"+ "{id}")
    public ResponseWithResults getReferenceById(@PathVariable String id) {

        return referenceService.getReferenceByProjectId(id);
    }

    @PutMapping(path = TappTermOfReferenceConstant.UPDATE_TERM_OF_REFERENCE + "/{id}")
    public TappTermOfReferenceRequest updateReference(@RequestBody TappTermOfReferenceRequest request, @PathVariable String id){
        System.out.println(request);
        return   referenceService.updateReference(request, id);
    }

    @PostMapping(TappTermOfReferenceConstant.CREATE_REFERENCE)
    public ResponseEntity<TappTermOfReferenceRequest> createReference(@RequestBody TappTermOfReferenceRequest termOfReferenceRequest){
        return referenceService.saveTermOfReference(termOfReferenceRequest);
    }
}
