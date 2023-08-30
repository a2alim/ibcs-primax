package com.ibcs.idsdp.rdpprtapp.web.controller.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.services.annexIII_aGoods.AnnexureGoodService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods.AnnexureGoodSaveWithChildRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestApiController
@RequestMapping("/rdpp-annexure-goods")
public class AnnexureGoodsController{

    private AnnexureGoodService anxService;

    /**
     * For create annexure goods
     * @param request
     * @return
     */
    @PostMapping(path= "/save" , produces = "application/json")
    public ResponseWithResults crateWithChild(@RequestBody AnnexureGoodSaveWithChildRequest request) {
        return anxService.saveWithChild(request);
    }

    /**
     * For get list data by form type
     * @param formType
     * @return
     */
    @GetMapping(path = "/get-list/{formType}/{id}" , produces = "application/json")
    public ResponseWithResults getDataByFormType(@PathVariable String formType, @PathVariable Long id) {
        return anxService.getDataByFormType(formType, id);
    }

    /**
     * For delete annexure goods records
     * @param id
     * @return
     */
    @DeleteMapping("/deleteRow/{id}")
    public ResponseEntity<ResponseStatus> deleteRow(@PathVariable Long id){
        return anxService.deleteRow(id);
    }
}

