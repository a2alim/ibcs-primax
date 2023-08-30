package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.trainninginstitute.model.domain.ENothiModel;
import com.ibcs.idsdp.trainninginstitute.services.ENotiService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.UploadENothiRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("e-nothi")
public class ENothiController {

    private final ENotiService eNotiService;

    @PostMapping
    public ResponseEntity<ApiMessageResponse> uploadENothi(@RequestBody UploadENothiRequest uploadENothiRequest){
        return eNotiService.uploadENothi(uploadENothiRequest);
    }

    @DeleteMapping("/{enothiId}")
    public ResponseEntity<ApiMessageResponse> deleteENothi(@PathVariable Long enothiId){
        return eNotiService.deleteENothi(enothiId);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<List<ENothiModel>>> getENothi(@RequestParam(defaultValue = "0") int pageNo,
                                                                           @RequestParam(defaultValue = "25") int pageSize,
                                                                           @RequestParam(required = false) Long fiscalYearId){
        return eNotiService.getENothi(pageNo,pageSize,fiscalYearId);
    }
}
