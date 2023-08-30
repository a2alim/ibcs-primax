package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.CreateLetterForGed;
import com.ibcs.idsdp.rpm.model.domain.SavedGedFeedbackAns;
import com.ibcs.idsdp.rpm.model.repositories.SavedGedFeedbackAnsRepository;
import com.ibcs.idsdp.rpm.services.SavedGedFeedbackAnsService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateLetterForGedRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.SavedGedFeedbackAnsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.SavedGedFeedbackAnsResponseDto;
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
public class SavedGedFeedbackAnsServiceImpl extends BaseService<SavedGedFeedbackAns, SavedGedFeedbackAnsRequestDto, SavedGedFeedbackAnsResponseDto> implements SavedGedFeedbackAnsService {
    private final SavedGedFeedbackAnsRepository savedGedFeedbackAnsRepository;
    private final MinioServerService minioServerService;

    @Autowired
    private IdGeneratorComponent idGeneratorComponent;

    public SavedGedFeedbackAnsServiceImpl(ServiceRepository<SavedGedFeedbackAns> repository, SavedGedFeedbackAnsRepository savedGedFeedbackAnsRepository, MinioServerService minioServerService) {
        super(repository);
        this.savedGedFeedbackAnsRepository = savedGedFeedbackAnsRepository;
        this.minioServerService = minioServerService;
    }

    @Override
    public Response doSave(String body, Optional<MultipartFile[]> files) {
        Response<SavedGedFeedbackAns> response = new Response<>();
        try {

            SavedGedFeedbackAns feedback = new SavedGedFeedbackAns();
            SavedGedFeedbackAnsRequestDto data = new Gson().fromJson(body, SavedGedFeedbackAnsRequestDto.class);
            if(data.getMode().equalsIgnoreCase("edit")){
                BeanUtils.copyProperties(data, feedback);

                //fetching data from db
                Optional<SavedGedFeedbackAns> byId = savedGedFeedbackAnsRepository.findById(data.getId());


                FileUploadResponse fileInfo = null;
                if (files.isPresent() && files.get().length > 0) {
                    fileInfo = new FileUploadResponse();
                    //delete file
                    if(!feedback.getBucketName().equals("") && !feedback.getFileName().equals("")){
                        minioServerService.setFileDownloadUrlDeleteFile(feedback.getBucketName(),feedback.getFileName());
                    }

                    fileInfo = minioServerService.getFileDownloadUrl(files.get()[0], "rms");
                }
                if (fileInfo != null) {
                    feedback.setFileDownloadUrl(fileInfo.getDownloadUrl());
                    feedback.setBucketName(fileInfo.getBucketName());
                    feedback.setFileName(fileInfo.getFileName());
                }

                if(byId.isPresent()) {
                    SavedGedFeedbackAns persistData = byId.get();
                    feedback.setIsDeleted(persistData.getIsDeleted());
                    feedback.setCreatedBy(persistData.getCreatedBy());
                    feedback.setCreatedOn(persistData.getCreatedOn());

                }


                SavedGedFeedbackAns save = savedGedFeedbackAnsRepository.save(feedback);


                response.setMessage("Updated Successfully");
                response.setSuccess(true);
                response.setObj(save);

            }else {


                BeanUtils.copyProperties(data, feedback);
                FileUploadResponse fileInfo = null;
                if (files.isPresent() && files.get().length > 0) {
                    fileInfo = new FileUploadResponse();
                    fileInfo = minioServerService.getFileDownloadUrl(files.get()[0], "rms");
                }
                if (fileInfo != null) {
                    feedback.setFileDownloadUrl(fileInfo.getDownloadUrl());
                    feedback.setBucketName(fileInfo.getBucketName());
                    feedback.setFileName(fileInfo.getFileName());
                }
                feedback.setUuid(idGeneratorComponent.generateUUID());
                SavedGedFeedbackAns save = savedGedFeedbackAnsRepository.save(feedback);


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

