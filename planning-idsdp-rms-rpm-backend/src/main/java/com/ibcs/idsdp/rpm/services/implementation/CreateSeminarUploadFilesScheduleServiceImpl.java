package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarUploadFilesSchedule;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarUploadFilesScheduleRepository;
import com.ibcs.idsdp.rpm.services.CreateSeminarUploadFilesScheduleService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarUploadFilesScheduleRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarUploadFilesScheduleResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class CreateSeminarUploadFilesScheduleServiceImpl extends BaseService<CreateSeminarUploadFilesSchedule, CreateSeminarUploadFilesScheduleRequestDto, CreateSeminarUploadFilesScheduleResponseDto> implements CreateSeminarUploadFilesScheduleService {


    private final CreateSeminarUploadFilesScheduleRepository uploadFilesScheduleRepository;
    private final CreateSeminarRepository createSeminarRepository;
    private final MinioServerService minioServerService;
    @Autowired
    private IdGeneratorComponent idGeneratorComponent;

    public CreateSeminarUploadFilesScheduleServiceImpl(ServiceRepository<CreateSeminarUploadFilesSchedule> repository, CreateSeminarUploadFilesScheduleRepository uploadFilesScheduleRepository, CreateSeminarRepository createSeminarRepository, MinioServerService minioServerService) {
        super(repository);
        this.uploadFilesScheduleRepository = uploadFilesScheduleRepository;
        this.createSeminarRepository = createSeminarRepository;
        this.minioServerService = minioServerService;
    }

    @Override
    public Response saveFiles(String body, Optional<MultipartFile[]> files) {
        Response<List<CreateSeminarUploadFilesSchedule>> response = new Response<>();
        try {


            List<CreateSeminarUploadFilesSchedule> agreementUploadSignatureFilesList = new ArrayList<>();
            Type listType = new TypeToken<ArrayList<CreateSeminarUploadFilesScheduleRequestDto>>() {
            }.getType();
            List<CreateSeminarUploadFilesScheduleRequestDto> data = new Gson().fromJson(body, listType);
            Optional<CreateSeminar> byId = createSeminarRepository.findById(data.get(0).getSeminarId());

            int counter = 0;
            for (CreateSeminarUploadFilesScheduleRequestDto row : data) {

                boolean isAvailable=true;

                CreateSeminarUploadFilesSchedule filesSchedule = new CreateSeminarUploadFilesSchedule();
                BeanUtils.copyProperties(row, filesSchedule);
                filesSchedule.setM2CreateSeminarId(byId.get());

                try{
                    isAvailable= !files.get()[counter].isEmpty();
                }catch(IndexOutOfBoundsException e){
                    isAvailable=false;
                }

                if (files.isPresent() && isAvailable) {

                    FileUploadResponse image = minioServerService.getFileDownloadUrl(files.get()[counter], "rms");
                    if (image != null) {
                        filesSchedule.setFileDownloadUrl(image.getDownloadUrl());
                        filesSchedule.setBucketName(image.getBucketName());
                        filesSchedule.setFileName(image.getFileName());
                    }



                }
                filesSchedule.setUuid(idGeneratorComponent.generateUUID());
                agreementUploadSignatureFilesList.add(filesSchedule);
                counter++;

            }

            List<CreateSeminarUploadFilesSchedule> createSeminarUploadFilesSchedules = uploadFilesScheduleRepository.saveAll(agreementUploadSignatureFilesList);
            response.setMessage("Saved Successfully!");
            response.setSuccess(true);
            response.setObj(createSeminarUploadFilesSchedules);


        } catch (Exception e) {
            response.setMessage("Save Failed");
            response.setSuccess(false);
            response.setObj(null);
            return response;

        }
        return response;
    }
}
