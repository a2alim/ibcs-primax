package com.ibcs.idsdp.rpm.services;


import com.ibcs.idsdp.util.Response;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */

public interface UserSignatureService  {

    Response saveResearcherSignature(MultipartFile signaturePic);

    Response updateResearcherSignature(MultipartFile signaturePic,
                              Long uploadUsersImageId);

    void deleteResearcherSignature(Long uploadUsersImageId);

    Response getResearcherSignature(Long uploadUsersImageId);
}
