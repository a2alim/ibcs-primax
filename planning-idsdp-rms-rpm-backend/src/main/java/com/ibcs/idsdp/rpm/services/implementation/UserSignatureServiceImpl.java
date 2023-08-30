package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.UserSignature;
import com.ibcs.idsdp.rpm.model.repositories.UserSignatureRepository;
import com.ibcs.idsdp.rpm.services.UserSignatureService;
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
public class UserSignatureServiceImpl implements UserSignatureService {

    private final UserSignatureRepository userSignatureRepo;
    private final MinioServerService minioServerService;

    @Override
    public Response saveResearcherSignature(MultipartFile profilePic) {

        UserSignature userSignature = new UserSignature();
        FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(profilePic, "rms");
        userSignature.setSignatureImageUrl(fileUploadResponse.getDownloadUrl());
        userSignature.setIsDeleted(true);
        userSignature.setEditable(true);
        userSignature.setBucketName(fileUploadResponse.getBucketName());
        userSignature.setFileName(fileUploadResponse.getFileName());
        userSignatureRepo.save(userSignature);

        Response<UserSignature> response = new Response<>();
        response.setSuccess(true);
        response.setMessage("Upload Successful");
        response.setObj(userSignature);
        return response;
    }

    @Override
    public Response updateResearcherSignature(MultipartFile profilePic, Long uploadUsersImageId) {
        Optional<UserSignature> uploadUsersImageOptional = userSignatureRepo.findById(uploadUsersImageId);
        Response<UserSignature> response = new Response<>();
        if (uploadUsersImageOptional.isPresent()) {
            FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(profilePic, "rms");
            UserSignature uploadUsersImage = uploadUsersImageOptional.get();
            uploadUsersImage.setSignatureImageUrl(fileUploadResponse.getDownloadUrl());
            uploadUsersImage.setFileName(fileUploadResponse.getFileName());
            userSignatureRepo.save(uploadUsersImage);
            response.setSuccess(true);
            response.setMessage("Update Successful");
            response.setObj(uploadUsersImage);
        }

        return response;
    }

    @Override
    public void deleteResearcherSignature(Long uploadUsersImageId) {
        Optional<UserSignature> uploadUsersImageOptional = userSignatureRepo.findById(uploadUsersImageId);

        if (uploadUsersImageOptional.isPresent()) {
            UserSignature uploadUsersImage = uploadUsersImageOptional.get();
            minioServerService.setFileDownloadUrlDeleteFile(uploadUsersImage.getBucketName(), uploadUsersImage.getFileName());
        }
    }

    @Override
    public Response getResearcherSignature(Long uploadUsersImageId) {
        Optional<UserSignature> uploadUsersImageOptional = userSignatureRepo.findById(uploadUsersImageId);
        Response<UserSignature> response = new Response();
        if (uploadUsersImageOptional.isPresent()) {
            response.setSuccess(true);
            response.setMessage("Update Successful");
            response.setObj(uploadUsersImageOptional.get());
        }
        return response;
    }
}
