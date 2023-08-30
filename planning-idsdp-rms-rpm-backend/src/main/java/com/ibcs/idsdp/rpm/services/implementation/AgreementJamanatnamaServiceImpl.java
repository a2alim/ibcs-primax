package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.AgreementJamanatnama;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.repositories.AgreementJamanatnamaRepository;
import com.ibcs.idsdp.rpm.model.repositories.AgreementWithResearcherRepository;
import com.ibcs.idsdp.rpm.services.AgreementJamanatnamaService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementJamanatnamaRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementJamanatnamaUpdateRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementJamanatnamaResponseDto;
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
public class AgreementJamanatnamaServiceImpl extends BaseService<AgreementJamanatnama, AgreementJamanatnamaRequestDto, AgreementJamanatnamaResponseDto> implements AgreementJamanatnamaService {

    private final AgreementJamanatnamaRepository agreementJamanatnamaRepository;
    private final MinioServerService minioServerService;
    private final AgreementWithResearcherRepository agreementWithResearcherRepository;
    @Autowired
    private IdGeneratorComponent idGeneratorComponent;


    public AgreementJamanatnamaServiceImpl(ServiceRepository<AgreementJamanatnama> repository, AgreementJamanatnamaRepository agreementJamanatnamaRepository, MinioServerService minioServerService, AgreementWithResearcherRepository agreementWithResearcherRepository) {
        super(repository);
        this.agreementJamanatnamaRepository = agreementJamanatnamaRepository;
        this.minioServerService = minioServerService;
        this.agreementWithResearcherRepository = agreementWithResearcherRepository;
    }

    @Override
    public Response<AgreementJamanatnamaResponseDto> createAgreementJamanatnama(AgreementJamanatnamaResponseDto agreementJamanat) {
        return null;
    }

    @Override
    public BooleanValueHolderDTO updateAgreementJamanatnama(AgreementJamanatnamaResponseDto agreementJamanat) {
        return null;
    }


    @Override
    public Response saveJamanatnama(String body, Optional<MultipartFile[]> files) {
        Response<AgreementJamanatnama> response = new Response<>();
        try {


            AgreementJamanatnama agreementJamanat = new AgreementJamanatnama();
            AgreementJamanatnamaRequestDto data = new Gson().fromJson(body, AgreementJamanatnamaRequestDto.class);
            //retrieving info data
            Optional<AgreementWithResearcher> byId = agreementWithResearcherRepository.findById(data.getAgreementId());
            if (!byId.isPresent()) {
                throw new ResourceNotFoundException("AgreementWithResearcher not found");
            }
            BeanUtils.copyProperties(data, agreementJamanat);
            agreementJamanat.setAgreementWithResearcherId(byId.get());
            FileUploadResponse image = null;
            FileUploadResponse signature = null;
            if (files.isPresent() && files.get().length > 0) {
                //save image
                image = new FileUploadResponse();
                image = minioServerService.getFileDownloadUrl(files.get()[0], "rms");

                if (files.isPresent() && files.get().length > 1) {
                    //save signature
                    signature = new FileUploadResponse();
                    signature = minioServerService.getFileDownloadUrl(files.get()[1], "rms");
                }
            }
            if (image != null) {
                agreementJamanat.setFileDownloadUrlImage(image.getDownloadUrl());
                agreementJamanat.setBucketNameImage(image.getBucketName());
                agreementJamanat.setFileNameImage(image.getFileName());
            }

            if (signature != null) {
                agreementJamanat.setFileDownloadUrlSignature(signature.getDownloadUrl());
                agreementJamanat.setBucketNameSignature(signature.getBucketName());
                agreementJamanat.setFileNameSignature(signature.getFileName());
            }
            agreementJamanat.setUuid(idGeneratorComponent.generateUUID());
            AgreementJamanatnama save = agreementJamanatnamaRepository.save(agreementJamanat);
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
    public Response updateJamanatnama(Long id, String body, Optional<MultipartFile[]> files) {
        Optional<AgreementWithResearcher> agreement = agreementWithResearcherRepository.findById(id);
        Optional<AgreementJamanatnama> optionalAgreementJamanatnama = agreementJamanatnamaRepository.findByAgreementWithResearcherId(agreement.get());
        if (!optionalAgreementJamanatnama.isPresent()) {
            throw new ResourceNotFoundException("AgreementJamanatnama not found by id");
        }
        AgreementJamanatnamaUpdateRequestDto data = new Gson().fromJson(body, AgreementJamanatnamaUpdateRequestDto.class);
        AgreementJamanatnama agreementJamanatnama = optionalAgreementJamanatnama.get();
        BeanUtils.copyProperties(data, agreementJamanatnama);
        if (files.isPresent()) {
            if (files.get()[0] != null) {
                FileUploadResponse profileFileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[0], "rms");
                agreementJamanatnama.setFileDownloadUrlImage(profileFileUploadResponse.getDownloadUrl());
                agreementJamanatnama.setBucketNameImage(profileFileUploadResponse.getBucketName());
                agreementJamanatnama.setFileNameImage(profileFileUploadResponse.getFileName());
            }
            if (files.get()[1] != null) {
                FileUploadResponse profileSignatureFileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[1], "rms");
                agreementJamanatnama.setFileDownloadUrlSignature(profileSignatureFileUploadResponse.getDownloadUrl());
                agreementJamanatnama.setBucketNameSignature(profileSignatureFileUploadResponse.getBucketName());
                agreementJamanatnama.setFileNameSignature(profileSignatureFileUploadResponse.getFileName());
            }
        }
        agreementJamanatnamaRepository.save(agreementJamanatnama);
        return new Response();

    }
}
