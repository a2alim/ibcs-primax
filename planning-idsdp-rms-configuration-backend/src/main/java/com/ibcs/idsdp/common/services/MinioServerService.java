package com.ibcs.idsdp.common.services;

import com.ibcs.idsdp.rmsConfigration.client.MinIoClientService;
import com.ibcs.idsdp.rmsConfigration.client.dto.response.FileUploadResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author moniruzzaman.rony
 * @create 10/3/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
@AllArgsConstructor
public class MinioServerService {

    private final MinIoClientService minIoClientService;

    public FileUploadResponse getFileDownloadUrl(MultipartFile file, String bucketName) {
        return minIoClientService.uploadFile(file, bucketName, file.getOriginalFilename());
    }

    public void setFileDownloadUrlDeleteFile(String bucketName, String objectName) {
         minIoClientService.deleteFile(bucketName,objectName);

    }
}
