package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.web.dto.request.IdentificationDTO;
import com.ibcs.idsdp.config.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ApprovalStatus;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ApprovalStatusRepository;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ApprovalStatusRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.ApprovalStatusResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
@Service
public class ApprovalStatusService {

    private final ApprovalStatusRepository approvalStatusRepository;
    private IdGeneratorComponent idGeneratorComponent;

    public IdentificationDTO createApprovalStatus(ApprovalStatusRequest approvalStatusRequest) {

        String uuid = idGeneratorComponent.generateUUID();

        ApprovalStatus approvalStatus = new ApprovalStatus();

        approvalStatus.setUuid(uuid);
        approvalStatus.setCode(generateCodeNumber(approvalStatusRequest.getApprovalStatusName()));
        approvalStatus.setApprovalStatusName(approvalStatusRequest.getApprovalStatusName());
        approvalStatus.setApprovalStatusNameBng(approvalStatusRequest.getApprovalStatusNameBng());
        approvalStatus.setDescription(approvalStatusRequest.getDescription());
        approvalStatus.setStatus(approvalStatusRequest.getStatus());
        approvalStatus.setCreatedOn(LocalDate.now());
        approvalStatus.setIsDeleted(false);
        approvalStatusRepository.saveAndFlush(approvalStatus);

        return new IdentificationDTO(uuid);
    }

    public List<ApprovalStatusResponse> getAllActiveApprovalStatusList(){

        List<ApprovalStatusResponse> approvalStatusResponseList = new ArrayList<>();
        List<ApprovalStatus> approvalStatusList = approvalStatusRepository.findAllByStatus(true);

        for (ApprovalStatus approvalStatus:approvalStatusList){

            if (!approvalStatus.getIsDeleted()){

                ApprovalStatusResponse approvalStatusResponse = new ApprovalStatusResponse();

                approvalStatusResponse.setId(String.valueOf(approvalStatus.getId()));
                approvalStatusResponse.setUuid(approvalStatus.getUuid());
                approvalStatusResponse.setCode(approvalStatus.getCode());
                approvalStatusResponse.setApprovalStatusName(approvalStatus.getApprovalStatusName());
                approvalStatusResponse.setApprovalStatusNameBng(approvalStatus.getApprovalStatusNameBng());
                approvalStatusResponse.setDescription(approvalStatus.getDescription());
                approvalStatusResponse.setStatus(approvalStatus.getStatus());

                approvalStatusResponseList.add(approvalStatusResponse);
            }

        }

        return approvalStatusResponseList;
    }

    public ApprovalStatusResponse getAllActiveApprovalStatusListBy(String uuid){

        Optional<ApprovalStatus> approvalStatusOptional = approvalStatusRepository.findAllByUuid(uuid);

        if (!approvalStatusOptional.isPresent()){
            throw new ResourceNotFoundException("Approval Status UUID Not Present yet!!");
        }
        ApprovalStatus approvalStatus = approvalStatusOptional.get();

        return ApprovalStatusResponse.builder()
                .code(approvalStatus.getCode())
                .approvalStatusName(approvalStatus.getApprovalStatusName())
                .approvalStatusNameBng(approvalStatus.getApprovalStatusNameBng())
                .description(approvalStatus.getDescription())
                .status(approvalStatus.getStatus())
                                      .build();
    }

    public void updateApprovalStatusBy(String uuid, ApprovalStatusRequest approvalStatusRequest){

        Optional<ApprovalStatus> approvalStatusOptional = approvalStatusRepository.findAllByUuid(uuid);

        if (!approvalStatusOptional.isPresent()){
            throw new ResourceNotFoundException("Approval Status UUID Not Present yet!!");
        }

        ApprovalStatus approvalStatus = approvalStatusOptional.get();

        //approvalStatus.setCode(approvalStatusRequest.getCode());
        approvalStatus.setApprovalStatusName(approvalStatusRequest.getApprovalStatusName());
        approvalStatus.setApprovalStatusNameBng(approvalStatusRequest.getApprovalStatusNameBng());
        approvalStatus.setDescription(approvalStatusRequest.getDescription());
        approvalStatus.setStatus(approvalStatusRequest.getStatus());

        approvalStatusRepository.save(approvalStatus);
    }

    public void deleteApprovalStatusBy(String uuid){

        Optional<ApprovalStatus> approvalStatusOptional = approvalStatusRepository.findAllByUuid(uuid);

        if (!approvalStatusOptional.isPresent()){
            throw new ResourceNotFoundException("Approval Status UUID Not Present yet!!");
        }

        ApprovalStatus approvalStatus = approvalStatusOptional.get();
        approvalStatus.setIsDeleted(true);
        approvalStatusRepository.save(approvalStatus);
    }

    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = approvalStatusRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }

    public List<ApprovalStatus> getAll() {
        return approvalStatusRepository.findAllByIsDeleted(false);
    }
}
