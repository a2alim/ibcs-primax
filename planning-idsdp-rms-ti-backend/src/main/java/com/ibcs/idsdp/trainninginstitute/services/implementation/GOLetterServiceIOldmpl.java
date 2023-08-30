package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.trainninginstitute.model.domain.GOLetterOldModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.GOLetterOldRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.PartialFinalPaymentRepository;
import com.ibcs.idsdp.trainninginstitute.services.GOLetterOldService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.GOLetterOldRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@AllArgsConstructor
@Service
public class GOLetterServiceIOldmpl implements GOLetterOldService {
    private final GOLetterOldRepository goLetterRepository;
    private final PartialFinalPaymentRepository partialFinalPaymentRepository;

    @Override
    public ResponseEntity<ApiMessageResponse> createGOLetter(GOLetterOldRequest goLetterRequest) {
        GOLetterOldModel goLetterModel = new GOLetterOldModel();
        BeanUtils.copyProperties(goLetterRequest, goLetterModel);

        PartialFinalPaymentModel partialFinalPaymentModel = partialFinalPaymentRepository.findByIdAndIsDeleted(goLetterRequest.getPartialFinalPaymentId(), false)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PartialFinalPayment not found"));

        partialFinalPaymentModel.setGoLetter(goLetterModel);

        partialFinalPaymentRepository.save(partialFinalPaymentModel);

        return new ResponseEntity<>(new ApiMessageResponse(201,"GOLetter created successfully"), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<GOLetterOldModel> getGOLetter(Long id) {
        GOLetterOldModel goLetterModel = goLetterRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "GOLetter not found"));

        return new ResponseEntity<>(goLetterModel, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> updateGOLetter(Long id, GOLetterOldRequest goLetterRequest) {
        GOLetterOldModel goLetterModel = goLetterRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "GOLetter not found"));

        BeanUtils.copyProperties(goLetterRequest, goLetterModel);

        goLetterRepository.save(goLetterModel);

        return new ResponseEntity<>(new ApiMessageResponse(200,"GOLetter updated successfully"), HttpStatus.OK);
    }
}
