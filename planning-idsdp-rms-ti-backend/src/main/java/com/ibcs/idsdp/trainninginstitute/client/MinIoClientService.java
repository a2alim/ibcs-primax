package com.ibcs.idsdp.trainninginstitute.client;

import com.ibcs.idsdp.trainninginstitute.client.dto.response.FileUploadResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

//@FeignClient(value = "planning-idsdp-uaa", url = "http://202.161.191.131:9403/api/")
@FeignClient(value = "planning-idsdp-files-storage-server", url = "http://202.161.191.131:9403/minio/")
public interface MinIoClientService {
    @PostMapping(path = "v1/upload?bucketName={bucketName}&fileName={fileName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    FileUploadResponse uploadFile(@RequestPart("file") MultipartFile file, @PathVariable String bucketName, @PathVariable String fileName);

    @DeleteMapping(path = "v1/removeObject/{bucketName}/{objectName}", consumes = MediaType.APPLICATION_JSON_VALUE)
    String deleteFile(@PathVariable String bucketName, @PathVariable String objectName);

}
