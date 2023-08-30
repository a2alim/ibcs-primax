package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.ImageData;
import com.ibcs.idsdp.model.repositories.ImageDataRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
@AllArgsConstructor
public class ImageUploadService {

    ImageStorageService imageStorageService;
    ImageDataRepository imageDataRepository;

    public ImageData upload(MultipartFile file) {
        String fileName = null;
        String fileDownloadUri = null;

        if (!file.isEmpty()) {
            fileName = imageStorageService.storeFile(file, file.getOriginalFilename());
            fileDownloadUri = "view/" + fileName;
        } else {
            System.err.println("File Not found");
        }

        try {
            ImageData imageDetails = new ImageData();
            imageDetails.setImageName(fileName);
            imageDetails.setImageType(file.getContentType());
            imageDetails.setUrlPath(fileDownloadUri);
            imageDataRepository.save(imageDetails);
            return imageDetails;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;


    }

    public String onlyFileUpload(MultipartFile file) {

        if (!file.isEmpty()) {
            return imageStorageService.storeFile(file, file.getOriginalFilename());
        } else {
            System.err.println("File Not found");
            return "";
        }
    }
}
