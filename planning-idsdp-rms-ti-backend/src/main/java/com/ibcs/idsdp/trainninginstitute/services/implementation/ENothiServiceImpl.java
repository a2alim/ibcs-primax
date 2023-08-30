package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.ENothiModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ENothiRepository;
import com.ibcs.idsdp.trainninginstitute.services.ENotiService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.UploadENothiRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ENothiServiceImpl implements ENotiService {

    private ENothiRepository eNothiRepository;
    private RandomGanaratorUtils randomGanaratorUtils;

    @Override
    public ResponseEntity<ApiMessageResponse> uploadENothi(UploadENothiRequest uploadENothiRequest) {
        ENothiModel eNothiModel = new ENothiModel();
        eNothiModel.setUuid(randomGanaratorUtils.getUuid());
        BeanUtils.copyProperties(uploadENothiRequest, eNothiModel);
        eNothiRepository.save(eNothiModel);
        return new ResponseEntity<>(new ApiMessageResponse(201,"E-Nothi Uploaded"), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteENothi(Long enothiId) {
        Optional<ENothiModel> eNothiModelOptional = eNothiRepository.findByIsDeletedAndId(false, enothiId);
        if (eNothiModelOptional.isPresent()){
            ENothiModel eNothiModel = eNothiModelOptional.get();
            eNothiModel.setIsDeleted(true);
            return new ResponseEntity<>(new ApiMessageResponse(200,"E-Nothi Deleted"), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(new ApiMessageResponse(404,"E-Nothi Not Found or Already Deleted"), HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<PaginationResponse<List<ENothiModel>>> getENothi(int pageNo, int pageSize, Long fiscalYearId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize);

        Page<ENothiModel> eNothiModelPage;

        if (fiscalYearId == null){
            eNothiModelPage = eNothiRepository.findByIsDeleted(false, pageable);
        }
        else {
            eNothiModelPage = eNothiRepository.findByIsDeletedAndFiscalYearId(false, fiscalYearId,pageable);
        }

        PaginationResponse<List<ENothiModel>> paginationResponse = new PaginationResponse<>(pageSize,pageNo,eNothiModelPage.getContent().size(),eNothiModelPage.isLast(),eNothiModelPage.getTotalElements(),eNothiModelPage.getTotalPages(),eNothiModelPage.getContent());

        if (eNothiModelPage.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No E-Nothi Found");
        } else {
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
        }
    }
}
