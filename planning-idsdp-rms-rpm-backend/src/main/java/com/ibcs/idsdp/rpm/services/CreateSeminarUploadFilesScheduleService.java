package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.CreateSeminarSendMail;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarSendMailRequestDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface CreateSeminarUploadFilesScheduleService {


    Response saveFiles(String body, Optional<MultipartFile[]> files);
}
