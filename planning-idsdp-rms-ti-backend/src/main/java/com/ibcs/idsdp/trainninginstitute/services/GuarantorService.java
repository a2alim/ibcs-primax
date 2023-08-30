package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.GuarantorModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.GuarantorRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.UploadGuarantorFileReguest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface GuarantorService {
    ResponseEntity<ApiMessageResponse> addGuarantor(GuarantorRequest guarantorRequest);

    ResponseEntity<PaginationResponse<List<GuarantorModel>>> getGuarantor(int pageNo, int pageSize, String guarantorName);

    ResponseEntity<ApiMessageResponse> updateGuarantorById(Long guarantorId, GuarantorRequest guarantorRequest);

    ResponseEntity<ApiMessageResponse> deleteGuarantorById(Long guarantorId);

    ResponseEntity<GuarantorModel> getGuarantorById(Long guarantorId);

    ResponseEntity<GuarantorModel> getGuarantorByProposalId(Long proposalId);

    ResponseEntity<ApiMessageResponse> uploadFile(Long guarantorId, UploadGuarantorFileReguest uploadGuarantorFileReguest);
}
