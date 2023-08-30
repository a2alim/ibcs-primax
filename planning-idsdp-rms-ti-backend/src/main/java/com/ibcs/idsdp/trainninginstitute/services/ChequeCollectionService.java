package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.trainninginstitute.model.domain.ChequeCollectionModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ChequeCollectionRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ChequeCollectionService {
    ResponseEntity<ApiMessageResponse> createChequeCollection(ChequeCollectionRequest chequeCollectionRequest);

    ResponseEntity<PaginationResponse<List<ChequeCollectionModel>>> getChequeCollections(int pageNo, int pageSize, String instituteName);

    ResponseEntity<ApiMessageResponse> updateChequeCollection(Long chequeId, ChequeCollectionRequest chequeCollectionRequest);

    ResponseEntity<ApiMessageResponse> deleteChequeCollection(Long chequeId);

    ResponseEntity<ApiResponse<ChequeCollectionModel>> getChequeById(Long chequeId);

    ResponseEntity<ApiMessageResponse> uploadSignatureDocument(Long chequeId, MinioAttachment minioAttachment);
}
