package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.util.Response;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface SavedGedFeedbackAnsService {
    Response doSave(String body, Optional<MultipartFile[]> files);
}
