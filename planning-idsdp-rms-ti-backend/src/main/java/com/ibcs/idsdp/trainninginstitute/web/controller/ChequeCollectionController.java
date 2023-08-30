package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.trainninginstitute.model.domain.ChequeCollectionModel;
import com.ibcs.idsdp.trainninginstitute.services.ChequeCollectionService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ChequeCollectionRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("cheque-collection")
public class ChequeCollectionController {
    private final ChequeCollectionService chequeCollectionService;

    @PostMapping
    public ResponseEntity<ApiMessageResponse> createChequeCollection(@RequestBody ChequeCollectionRequest chequeCollectionRequest){
        return chequeCollectionService.createChequeCollection(chequeCollectionRequest);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<List<ChequeCollectionModel>>> getChequeCollections(@RequestParam(defaultValue = "0") int pageNo,
                                                                                                @RequestParam(defaultValue = "25") int pageSize,
                                                                                                @RequestParam(required = false) String instituteName){
        return chequeCollectionService.getChequeCollections(pageNo,pageSize,instituteName);
    }

    @PutMapping("/{chequeId}")
    public ResponseEntity<ApiMessageResponse> updateChequeCollection(@PathVariable Long chequeId,
                                                                     @RequestBody ChequeCollectionRequest chequeCollectionRequest){
        return chequeCollectionService.updateChequeCollection(chequeId,chequeCollectionRequest);
    }

    @DeleteMapping("/{chequeId}")
    public ResponseEntity<ApiMessageResponse> deleteChequeCollection(@PathVariable Long chequeId){
        return chequeCollectionService.deleteChequeCollection(chequeId);
    }

    @GetMapping("/{chequeId}")
    public ResponseEntity<ApiResponse<ChequeCollectionModel>> getChequeById(@PathVariable Long chequeId){
        return chequeCollectionService.getChequeById(chequeId);
    }

    @PutMapping("/upload-signatured-document/{chequeId}")
    public ResponseEntity<ApiMessageResponse> uploadSignatureDocument(@PathVariable Long chequeId,
                                                                      @RequestBody MinioAttachment minioAttachment){
        return chequeCollectionService.uploadSignatureDocument(chequeId,minioAttachment);
    }
}
