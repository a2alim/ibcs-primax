package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.AgreementJamanatnama;
import com.ibcs.idsdp.rpm.model.domain.AgreementParty;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.repositories.AgreementPartyRepository;
import com.ibcs.idsdp.rpm.model.repositories.AgreementWithResearcherRepository;
import com.ibcs.idsdp.rpm.services.AgreementPartyService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementJamanatnamaRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementPartyRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementPartyResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class AgreementPartyServiceImpl extends BaseService<AgreementParty, AgreementPartyRequestDto, AgreementPartyResponseDto> implements AgreementPartyService {

    private final AgreementPartyRepository agreementPartyRepository;
    private final MinioServerService minioServerService;
    private final AgreementWithResearcherRepository agreementWithResearcherRepository;
    @Autowired
    private IdGeneratorComponent idGeneratorComponent;

    public AgreementPartyServiceImpl(ServiceRepository<AgreementParty> repository, AgreementPartyRepository agreementPartyRepository, MinioServerService minioServerService, AgreementWithResearcherRepository agreementWithResearcherRepository) {
        super(repository);
        this.agreementPartyRepository = agreementPartyRepository;
        this.minioServerService = minioServerService;
        this.agreementWithResearcherRepository = agreementWithResearcherRepository;
    }

    @Override
    public AccessTokenDetail tokenDetails() {
        return super.tokenDetails();
    }

    @Override
    public Response saveParty(String body, Optional<MultipartFile[]> files) {
        Response<AgreementParty> response = new Response<>();
        try {

            AgreementParty agreementParty = new AgreementParty();
            AgreementPartyRequestDto data = new Gson().fromJson(body, AgreementPartyRequestDto.class);
            //retrieving info data
            Optional<AgreementWithResearcher> byId = agreementWithResearcherRepository.findById(data.getAgreementId());
            BeanUtils.copyProperties(data, agreementParty);
            agreementParty.setAgreementWithResearcherId(byId.get());
            FileUploadResponse image = null;
            if (files.isPresent() && files.get().length > 0) {
                //save image
                image = new FileUploadResponse();
                image = minioServerService.getFileDownloadUrl(files.get()[0], "rms");

            }
            if (image != null) {
                agreementParty.setFileDownloadUrlSignature(image.getDownloadUrl());
                agreementParty.setBucketNameSignature(image.getBucketName());
                agreementParty.setFileNameSignature(image.getFileName());
            }

            agreementParty.setUuid(idGeneratorComponent.generateUUID());
            AgreementParty save = agreementPartyRepository.save(agreementParty);
            response.setMessage("Saved Successfully!");
            response.setSuccess(true);
            response.setObj(save);


        } catch (Exception e) {

            //Response<CreateLetterForGed> response = new Response<>();
            response.setMessage("Save Failed");
            response.setSuccess(false);
            response.setObj(null);
            return response;

        }
        return response;




    }

    @Override
    public Response updateAgreementJamanatnama(String agreementId, String body, Optional<MultipartFile[]> files) {
        Response<AgreementParty> response = new Response<>();
        try {
            Optional<AgreementWithResearcher> agreementWithResearcher = agreementWithResearcherRepository.findById(Long.valueOf(agreementId));
            Optional<AgreementParty> agreementPartyOptional = agreementPartyRepository.findByAgreementWithResearcherId(agreementWithResearcher.get());
            AgreementParty agreementParty = agreementPartyOptional.get();
            
            AgreementPartyRequestDto agreementPartyRequestDto  = objectMapperReadValue(body, AgreementPartyRequestDto.class);
            
            //AgreementPartyRequestDto agreementPartyRequestDto = new Gson().fromJson(body, AgreementPartyRequestDto.class);
            //retrieving info data

            BeanUtils.copyProperties(body, agreementParty);
            agreementParty.setAgreementWithResearcherId(agreementWithResearcher.get());
            FileUploadResponse image = null;
            if (files.isPresent() && files.get().length > 0) {
                //save image
                image = new FileUploadResponse();
                image = minioServerService.getFileDownloadUrl(files.get()[0], "rms");

            }
            if (image != null) {
                agreementParty.setFileDownloadUrlSignature(image.getDownloadUrl());
                agreementParty.setBucketNameSignature(image.getBucketName());
                agreementParty.setFileNameSignature(image.getFileName());
            }

            agreementParty.setUuid(idGeneratorComponent.generateUUID());
            AgreementParty save = agreementPartyRepository.save(agreementParty);
            response.setMessage("Saved Successfully!");
            response.setSuccess(true);
            response.setObj(save);


        } catch (Exception e) {

            //Response<CreateLetterForGed> response = new Response<>();
            response.setMessage("Save Failed");
            response.setSuccess(false);
            response.setObj(null);
            return response;

        }
        return response;
    }

}
