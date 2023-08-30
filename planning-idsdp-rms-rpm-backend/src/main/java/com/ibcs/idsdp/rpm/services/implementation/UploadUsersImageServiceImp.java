package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.UploadUsersImage;
import com.ibcs.idsdp.rpm.model.repositories.UploadUsersImageRepository;
import com.ibcs.idsdp.rpm.services.UploadUsersImageService;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
@AllArgsConstructor
public class UploadUsersImageServiceImp implements UploadUsersImageService {

    private final UploadUsersImageRepository uploadUsersImageRepository;
    private final MinioServerService minioServerService;

    @Override
    public Response uploadUsersImage(MultipartFile profilePic) {

        UploadUsersImage uploadUsersImage = new UploadUsersImage();
        FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(profilePic, "rms");
        uploadUsersImage.setUserImageUrl(fileUploadResponse.getDownloadUrl());
        uploadUsersImage.setIsDeleted(true);
        uploadUsersImage.setEditable(true);
        uploadUsersImage.setBucketName(fileUploadResponse.getBucketName());
        uploadUsersImage.setFileName(fileUploadResponse.getFileName());
        uploadUsersImageRepository.save(uploadUsersImage);

        Response<UploadUsersImage> response = new Response<>();
        response.setSuccess(true);
        response.setMessage("Upload Successful");
        response.setObj(uploadUsersImage);
        return response;
    }

    @Override
    public Response updateUsersImage(MultipartFile profilePic, Long uploadUsersImageId) {
        Optional<UploadUsersImage> uploadUsersImageOptional = uploadUsersImageRepository.findById(uploadUsersImageId);
        Response<UploadUsersImage> response = new Response<>();
        if (uploadUsersImageOptional.isPresent()) {
            FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(profilePic, "rms");
            UploadUsersImage uploadUsersImage = uploadUsersImageOptional.get();
            uploadUsersImage.setUserImageUrl(fileUploadResponse.getDownloadUrl());
            uploadUsersImage.setFileName(fileUploadResponse.getFileName());
            uploadUsersImageRepository.save(uploadUsersImage);
            response.setSuccess(true);
            response.setMessage("Update Successful");
            response.setObj(uploadUsersImage);
        }

        return response;
    }

    @Override
    public void deleteUsersImage(Long uploadUsersImageId) {
        Optional<UploadUsersImage> uploadUsersImageOptional = uploadUsersImageRepository.findById(uploadUsersImageId);

        if (uploadUsersImageOptional.isPresent()) {
            UploadUsersImage uploadUsersImage = uploadUsersImageOptional.get();
            minioServerService.setFileDownloadUrlDeleteFile(uploadUsersImage.getBucketName(), uploadUsersImage.getFileName());
        }
    }

    @Override
    public Response getResearcherProfileProfile(Long uploadUsersImageId) {
        Optional<UploadUsersImage> uploadUsersImageOptional = uploadUsersImageRepository.findById(uploadUsersImageId);
        Response<UploadUsersImage> response = new Response();
        if (uploadUsersImageOptional.isPresent()) {
            response.setSuccess(true);
            response.setMessage("Update Successful");
            response.setObj(uploadUsersImageOptional.get());
        }
        return response;
    }
}
