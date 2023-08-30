package com.ibcs.idsdp.dpptapp.web.controller.tappAnnexurs;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.services.tappAnnexurs.TappAnnexureGoodService;
import com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs.TappAnnexureGoodSaveWithChildRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping("tapp-annexure-goods/")
public class TappAnnexureGoodsController {

    public final TappAnnexureGoodService tappAnnexureGoodService;

    /**
     * Constructor
     * @param tappAnnexureGoodService
     */
    public TappAnnexureGoodsController(TappAnnexureGoodService tappAnnexureGoodService) {
        this.tappAnnexureGoodService = tappAnnexureGoodService;
    }

    /**
     * For create tapp annexure goods records
     * @param request
     * @return
     */
    @PostMapping(path= "save" , produces = "application/json")
    public ResponseWithResults crateWithChild(@RequestBody TappAnnexureGoodSaveWithChildRequest request) {
        return tappAnnexureGoodService.saveWithChild(request);
    }

    /**
     * For get list of tapp annexure goods records
     * @param formType
     * @return
     */
    @GetMapping(path = "get-list" + "/{formType}"+"/{projectUuid}" , produces = "application/json")
    public ResponseWithResults getDataByFormType(@PathVariable String formType, @PathVariable String projectUuid) {
        return tappAnnexureGoodService.getDataByFormType(formType, projectUuid, false);
    }

    /**
     * For delete tapp annexure goods records
     * @param uuid
     * @return
     */
    @DeleteMapping("/deleteRow/{uuid}")
    public ResponseEntity<ResponseStatus> deleteRow(@PathVariable String uuid){
        return tappAnnexureGoodService.deleteRow(uuid);
    }



}

