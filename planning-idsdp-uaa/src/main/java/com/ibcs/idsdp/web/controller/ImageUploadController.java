package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.exceptions.ResourceNotFoundException;
import com.ibcs.idsdp.model.domain.ImageData;
import com.ibcs.idsdp.services.ImageStorageService;
import com.ibcs.idsdp.services.ImageUploadService;
import com.ibcs.idsdp.web.dto.response.ImageDataResponse;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

import static com.ibcs.idsdp.constants.ApiConstants.*;
import static com.ibcs.idsdp.constants.ImageUploadApiConstants.*;

@ApiController
@AllArgsConstructor
public class ImageUploadController {

    private final ImageStorageService imageStorageService;

    private final ImageUploadService imageUploadService;

    @PostMapping(value = UPLOAD_IMAGE_ENDPOINT)
    public ResponseEntity<?> uploadImage(@RequestHeader(value = "accessToken") String accessToken,
                                         @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        if(!accessToken.isEmpty()) {
            ImageData imageData = null;
            if (imageFile != null) {
                imageData = imageUploadService.upload(imageFile);
            }
            ImageDataResponse imageDataResponse = new ImageDataResponse();
            imageDataResponse.setImageUrl(imageData.getUrlPath());
            return new ResponseEntity<>(imageDataResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity("Invalid Token", HttpStatus.UNAUTHORIZED);
        }
    }


    @GetMapping(value = VIEW_IMAGE , produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = imageStorageService.loadFileAsResource(fileName);
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            throw new ResourceNotFoundException("Image Not Found");
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }


}
