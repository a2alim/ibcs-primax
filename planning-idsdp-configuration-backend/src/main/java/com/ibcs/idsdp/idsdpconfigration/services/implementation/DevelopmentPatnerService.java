package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.web.dto.request.IdentificationDTO;
import com.ibcs.idsdp.config.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.idsdpconfigration.model.domain.DevelopmentPartner;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.DevelopmentPatnerRepository;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DevelopmentPatnerRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.DevelopmentPatnerResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
@Service
public class DevelopmentPatnerService {

    private final DevelopmentPatnerRepository developmentPatnerRepository;
    private IdGeneratorComponent idGeneratorComponent;

    public IdentificationDTO createDevelopmentDevelopmentPartner(DevelopmentPatnerRequest developmentPatnerRequest) {

        String uuid = idGeneratorComponent.generateUUID();

        DevelopmentPartner developmentPartner = new DevelopmentPartner();

        developmentPartner.setUuid(uuid);
        developmentPartner.setCode(generateCodeNumber(developmentPatnerRequest.getDevelopmentPartnerName()));
        developmentPartner.setDevelopmentPartnerName(developmentPatnerRequest.getDevelopmentPartnerName());
        developmentPartner.setDevelopmentPartnerNameBng(developmentPatnerRequest.getDevelopmentPartnerNameBng());
        developmentPartner.setDescription(developmentPatnerRequest.getDescription());
        developmentPartner.setStatus(developmentPatnerRequest.getStatus());
        developmentPartner.setCreatedOn(LocalDate.now());
        developmentPartner.setIsDeleted(false);
        developmentPatnerRepository.saveAndFlush(developmentPartner);

        return new IdentificationDTO(uuid);
    }

    public List<DevelopmentPatnerResponse> getAllActiveDevelopmentPartnerList() {

        List<DevelopmentPatnerResponse> developmentPartnerResponseArrayList = new ArrayList<>();

        List<DevelopmentPartner> developmentPartnerList = developmentPatnerRepository.findAll();

        for (DevelopmentPartner developmentPartner : developmentPartnerList) {

            if (!developmentPartner.getIsDeleted()) {

                DevelopmentPatnerResponse developmentPatnerResponse = new DevelopmentPatnerResponse();
                developmentPatnerResponse.setId(developmentPartner.getId());
                developmentPatnerResponse.setUuid(developmentPartner.getUuid());
                developmentPatnerResponse.setCode(developmentPartner.getCode());
                developmentPatnerResponse.setDevelopmentPartnerName(developmentPartner.getDevelopmentPartnerName());
                developmentPatnerResponse.setDevelopmentPartnerNameBng(developmentPartner.getDevelopmentPartnerNameBng());
                developmentPatnerResponse.setDescription(developmentPartner.getDescription());
                developmentPatnerResponse.setStatus(developmentPartner.getStatus());

                developmentPartnerResponseArrayList.add(developmentPatnerResponse);
            }

        }

        return developmentPartnerResponseArrayList;
    }

    public DevelopmentPatnerResponse getDevelopmentPartnerListBy(String uuid) {

        Optional<DevelopmentPartner> developmentPartnerOptional = developmentPatnerRepository.findAllByUuid(uuid);

        if (!developmentPartnerOptional.isPresent()) {
            throw new ResourceNotFoundException("Approval Status UUID Not Present yet!!");
        }
        DevelopmentPartner developmentPartner = developmentPartnerOptional.get();

        return DevelopmentPatnerResponse.builder()
                .code(developmentPartner.getCode())
                .developmentPartnerName(developmentPartner.getDevelopmentPartnerName())
                .developmentPartnerNameBng(developmentPartner.getDevelopmentPartnerNameBng())
                .description(developmentPartner.getDescription())
                .status(developmentPartner.getStatus())
                .build();
    }

    public void updateDevelopmentPartnerBy(String uuid, DevelopmentPatnerRequest developmentPatnerRequest) {

        Optional<DevelopmentPartner> developmentPartnerOptional = developmentPatnerRepository.findAllByUuid(uuid);

        if (!developmentPartnerOptional.isPresent()) {
            throw new ResourceNotFoundException("Approval Status UUID Not Present yet!!");
        }

        DevelopmentPartner developmentPartner = developmentPartnerOptional.get();

        developmentPartner.setDevelopmentPartnerName(developmentPatnerRequest.getDevelopmentPartnerName());
        developmentPartner.setDevelopmentPartnerNameBng(developmentPatnerRequest.getDevelopmentPartnerNameBng());
        developmentPartner.setDescription(developmentPatnerRequest.getDescription());
        developmentPartner.setStatus(developmentPatnerRequest.getStatus());

        developmentPatnerRepository.save(developmentPartner);
    }


    public void deleteDevelopmentPartnerBy(String uuid) {

        Optional<DevelopmentPartner> developmentPartnerOptional = developmentPatnerRepository.findAllByUuid(uuid);

        if (!developmentPartnerOptional.isPresent()) {
            throw new ResourceNotFoundException("Approval Status UUID Not Present yet!!");
        }

        DevelopmentPartner developmentPartner = developmentPartnerOptional.get();
        developmentPartner.setIsDeleted(true);
        developmentPatnerRepository.save(developmentPartner);
    }


    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = developmentPatnerRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }

    public DevelopmentPatnerResponse getById(Long id) {
        DevelopmentPatnerResponse response = new DevelopmentPatnerResponse();
        DevelopmentPartner developmentPartner = developmentPatnerRepository.findByIdAndIsDeleted(id, false);
        BeanUtils.copyProperties(developmentPartner, response);
        return response;
    }
}
