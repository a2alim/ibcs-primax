package com.ibcs.idsdp.rpm.web.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by : rakibul.hasan on 12/2/2021 5:06 PM
 * github : https://github.com/rhmtechno
 */
@Data
public class FileRequest {
    Long id;
    String fileName;
}
