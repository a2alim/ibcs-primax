package com.ibcs.idsdp.trainninginstitute.web.controller;


import com.ibcs.idsdp.trainninginstitute.model.domain.GuarantorModel;
import com.ibcs.idsdp.trainninginstitute.services.GuarantorService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.GuarantorRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.UploadGuarantorFileReguest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("guarantor-agreement")
public class GuarantorController {

    private  final GuarantorService guarantorService;

    @PostMapping()
    public ResponseEntity<ApiMessageResponse> addGuarantor(@RequestBody GuarantorRequest guarantorRequest){
        return guarantorService.addGuarantor(guarantorRequest);
    }

    @GetMapping()
    public ResponseEntity<PaginationResponse<List<GuarantorModel>>> getGuarantor(@RequestParam(defaultValue = "0") int pageNo,
                                                                                 @RequestParam(defaultValue = "25") int pageSize,
                                                                                 @RequestParam(required = false) String guarantorName){
        return guarantorService.getGuarantor(pageNo,pageSize,guarantorName);
    }

    @GetMapping("/{guarantorId}")
    public ResponseEntity<GuarantorModel> getGuarantorById(@PathVariable Long guarantorId){
        return guarantorService.getGuarantorById(guarantorId);
    }

    @PutMapping("/{guarantorId}")
    public ResponseEntity<ApiMessageResponse> updateGuarantorById(@PathVariable Long guarantorId,@RequestBody GuarantorRequest guarantorRequest){
        return guarantorService.updateGuarantorById(guarantorId,guarantorRequest);
    }

    @DeleteMapping("/{guarantorId}")
    public ResponseEntity<ApiMessageResponse> deleteGuarantorById(@PathVariable Long guarantorId){
        return guarantorService.deleteGuarantorById(guarantorId);
    }

    @GetMapping("/proposal/{proposalId}")
    public ResponseEntity<GuarantorModel> getGuarantorByProposalId(@PathVariable Long proposalId){
        return guarantorService.getGuarantorByProposalId(proposalId);
    }

    @PutMapping("/file-upload/{guarantorId}")
    public ResponseEntity<ApiMessageResponse> uploadFile(@PathVariable Long guarantorId,
                                                         @RequestBody UploadGuarantorFileReguest uploadGuarantorFileReguest){
        return guarantorService.uploadFile(guarantorId, uploadGuarantorFileReguest);
    }
}
