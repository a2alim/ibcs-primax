package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.UploadUsersImage;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */
public interface UploadUsersImageService {

    Response uploadUsersImage(MultipartFile profilePic);

    Response updateUsersImage(MultipartFile profilePic,
                              Long uploadUsersImageId);

    void deleteUsersImage(Long uploadUsersImageId);

    Response getResearcherProfileProfile(Long uploadUsersImageId);
}
