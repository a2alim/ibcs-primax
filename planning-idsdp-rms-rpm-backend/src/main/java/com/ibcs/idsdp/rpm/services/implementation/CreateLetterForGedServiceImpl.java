package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.CreateLetterForGed;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.model.repositories.CreateLetterForGedRepository;
import com.ibcs.idsdp.rpm.services.CreateLetterForGedService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateLetterForGedRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateLetterForGedResponseDto;
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
public class CreateLetterForGedServiceImpl extends BaseService<CreateLetterForGed, CreateLetterForGedRequestDto, CreateLetterForGedResponseDto> implements CreateLetterForGedService {
    private final CreateLetterForGedRepository createLetterForGedRepository;
    private final MinioServerService minioServerService;
    @Autowired
    private IdGeneratorComponent idGeneratorComponent;

    public CreateLetterForGedServiceImpl(ServiceRepository<CreateLetterForGed> repository, CreateLetterForGedRepository createLetterForGedRepository, MinioServerService minioServerService) {
        super(repository);
        this.createLetterForGedRepository = createLetterForGedRepository;
        this.minioServerService = minioServerService;
    }

    @Override
    public Response saveLetter(String body, Optional<MultipartFile[]> files) {
        Response<CreateLetterForGed> response = new Response<>();
        try {

            CreateLetterForGed createLetterForGedRequestDto = new CreateLetterForGed();
            CreateLetterForGedRequestDto data = new Gson().fromJson(body, CreateLetterForGedRequestDto.class);
            if(data.getMode().equalsIgnoreCase("edit")){
                BeanUtils.copyProperties(data, createLetterForGedRequestDto);
                
                //fetching data from db
                Optional<CreateLetterForGed> byId = createLetterForGedRepository.findById(data.getId());


                FileUploadResponse fileInfo = null;
                if (files.isPresent() && files.get().length > 0) {
                    fileInfo = new FileUploadResponse();
                    //delete file
                    if(!createLetterForGedRequestDto.getBucketName().equals("") && !createLetterForGedRequestDto.getFileName().equals("")){
                        minioServerService.setFileDownloadUrlDeleteFile(createLetterForGedRequestDto.getBucketName(),createLetterForGedRequestDto.getFileName());
                    }

                    fileInfo = minioServerService.getFileDownloadUrl(files.get()[0], "rms");
                }
                if (fileInfo != null) {
                    createLetterForGedRequestDto.setFileDownloadUrl(fileInfo.getDownloadUrl());
                    createLetterForGedRequestDto.setBucketName(fileInfo.getBucketName());
                    createLetterForGedRequestDto.setFileName(fileInfo.getFileName());
                }

                if(byId.isPresent()) {
                    CreateLetterForGed persistData = byId.get();
                    createLetterForGedRequestDto.setIsDeleted(persistData.getIsDeleted());
                    createLetterForGedRequestDto.setCreatedBy(persistData.getCreatedBy());
                    createLetterForGedRequestDto.setCreatedOn(persistData.getCreatedOn());

                }
                

                CreateLetterForGed save = createLetterForGedRepository.save(createLetterForGedRequestDto);


                response.setMessage("Updated Successfully");
                response.setSuccess(true);
                response.setObj(save);

            }else {


                BeanUtils.copyProperties(data, createLetterForGedRequestDto);
                FileUploadResponse fileInfo = null;
                if (files.isPresent() && files.get().length > 0) {
                    fileInfo = new FileUploadResponse();
                    fileInfo = minioServerService.getFileDownloadUrl(files.get()[0], "rms");
                }
                if (fileInfo != null) {
                    createLetterForGedRequestDto.setFileDownloadUrl(fileInfo.getDownloadUrl());
                    createLetterForGedRequestDto.setBucketName(fileInfo.getBucketName());
                    createLetterForGedRequestDto.setFileName(fileInfo.getFileName());
                }
                createLetterForGedRequestDto.setUuid(idGeneratorComponent.generateUUID());
                CreateLetterForGed save = createLetterForGedRepository.save(createLetterForGedRequestDto);


                response.setMessage("Saved Successfully!");
                response.setSuccess(true);
                response.setObj(save);

            }

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
