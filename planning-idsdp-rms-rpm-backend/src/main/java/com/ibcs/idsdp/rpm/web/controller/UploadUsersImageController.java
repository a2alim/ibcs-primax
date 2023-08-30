package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.UploadUsersImageService;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author moniruzzaman.rony
 * @create 10/6/21
 * @github `https://github.com/moniruzzamanrony`
 */

@RestApiController
@AllArgsConstructor
@RequestMapping("researcher-profile/profile-image/")
public class UploadUsersImageController {
    private final UploadUsersImageService uploadUsersImageService;

    @GetMapping("/{uploadUsersImageId}")
    public Response getResearcherProfileProfile(@PathVariable Long uploadUsersImageId) {
        return uploadUsersImageService.getResearcherProfileProfile(uploadUsersImageId);
    }

    @PostMapping("upload")
    public Response saveResearcherProfileProfile(MultipartFile profilePic) {
        return uploadUsersImageService.uploadUsersImage(profilePic);
    }

    @PutMapping("update/{uploadUsersImageId}")
    public Response updateResearcherProfileProfile(MultipartFile profilePic,
                                                   @PathVariable Long uploadUsersImageId) {
        return uploadUsersImageService.updateUsersImage(profilePic, uploadUsersImageId);
    }

    @DeleteMapping("delete/{uploadUsersImageId}")
    public void deleteResearcherProfileProfile(@PathVariable Long uploadUsersImageId) {
        uploadUsersImageService.deleteUsersImage(uploadUsersImageId);
    }
}
