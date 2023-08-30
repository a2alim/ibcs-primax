package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.UploadUsersImageService;
import com.ibcs.idsdp.rpm.services.UserSignatureService;
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
@RequestMapping("researcher-profile/user-signature/")
public class UserSignatureController {
    private final UserSignatureService userSignatureService;

    @GetMapping("/{uploadUsersSignatureImageId}")
    public Response getResearcherSignature(@PathVariable Long uploadUsersSignatureImageId) {
        return userSignatureService.getResearcherSignature(uploadUsersSignatureImageId);
    }

    @PostMapping("upload")
    public Response saveResearcherSignature(MultipartFile signaturePic) {
        return userSignatureService.saveResearcherSignature(signaturePic);
    }

    @PutMapping("update/{uploadUsersSignatureImageId}")
    public Response updateResearcherSignature(MultipartFile signaturePic,
                                                   @PathVariable Long uploadUsersSignatureImageId) {
        return userSignatureService.updateResearcherSignature(signaturePic, uploadUsersSignatureImageId);
    }

    @DeleteMapping("delete/{uploadUsersSignatureImageId}")
    public void deleteResearcherSignature(@PathVariable Long uploadUsersSignatureImageId) {
        userSignatureService.deleteResearcherSignature(uploadUsersSignatureImageId);
    }
}
