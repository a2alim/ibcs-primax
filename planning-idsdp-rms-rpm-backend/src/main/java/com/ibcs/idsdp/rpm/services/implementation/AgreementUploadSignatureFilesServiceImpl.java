package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.AgreementUploadSignatureFiles;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.repositories.AgreementUploadSignatureFilesRepository;
import com.ibcs.idsdp.rpm.model.repositories.AgreementWithResearcherRepository;
import com.ibcs.idsdp.rpm.services.AgreementUploadSignatureFilesService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementUploadSignatureFilesRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementUploadSignatureFilesResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.lang.reflect.Type;
import com.google.gson.reflect.TypeToken;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class AgreementUploadSignatureFilesServiceImpl extends BaseService<AgreementUploadSignatureFiles, AgreementUploadSignatureFilesRequestDto, AgreementUploadSignatureFilesResponseDto> implements AgreementUploadSignatureFilesService {

    private final AgreementUploadSignatureFilesRepository signatureFilesRepository;
    private final MinioServerService minioServerService;
    private final AgreementWithResearcherRepository agreementWithResearcherRepository;
    @Autowired
    private IdGeneratorComponent idGeneratorComponent;

    public AgreementUploadSignatureFilesServiceImpl(ServiceRepository<AgreementUploadSignatureFiles> repository, AgreementUploadSignatureFilesRepository signatureFilesRepository, MinioServerService minioServerService, AgreementWithResearcherRepository agreementWithResearcherRepository) {
        super(repository);
        this.signatureFilesRepository = signatureFilesRepository;
        this.minioServerService = minioServerService;
        this.agreementWithResearcherRepository = agreementWithResearcherRepository;
    }

    @Override
    public Response saveSignature(String body, Optional<MultipartFile[]> files) {
        Response<List<AgreementUploadSignatureFiles>> response = new Response<>();
        try {


            List<AgreementUploadSignatureFiles> agreementUploadSignatureFilesList = new ArrayList<>();
            Type listType = new TypeToken<ArrayList<AgreementUploadSignatureFilesResponseDto>>(){}.getType();
            List<AgreementUploadSignatureFilesResponseDto> data = new Gson().fromJson(body,listType);
            Optional<AgreementWithResearcher> byId = agreementWithResearcherRepository.findById(data.get(0).getAgreementId());

            int counter=0;
            for(AgreementUploadSignatureFilesResponseDto row:data){

                AgreementUploadSignatureFiles agreementUploadSignatureFiles = new AgreementUploadSignatureFiles();
                BeanUtils.copyProperties(row, agreementUploadSignatureFiles);
                agreementUploadSignatureFiles.setAgreementWithResearcherId(byId.get());

                if (files.isPresent() && files.get().length > 0) {

                        FileUploadResponse image = minioServerService.getFileDownloadUrl(files.get()[counter], "rms");
                        if (image != null) {
                            agreementUploadSignatureFiles.setFileDownloadUrlSignature(image.getDownloadUrl());
                            agreementUploadSignatureFiles.setBucketNameSignature(image.getBucketName());
                            agreementUploadSignatureFiles.setFileNameSignature(image.getFileName());
                        }

                    counter++;

                }
                agreementUploadSignatureFiles.setUuid(idGeneratorComponent.generateUUID());
                agreementUploadSignatureFilesList.add(agreementUploadSignatureFiles);

            }

          List<AgreementUploadSignatureFiles> uploadSignatureFiles = signatureFilesRepository.saveAll(agreementUploadSignatureFilesList);
            response.setMessage("Saved Successfully!");
            response.setSuccess(true);
            response.setObj(uploadSignatureFiles);


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
