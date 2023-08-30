package com.ibcs.idsdp.rpm.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by : rakibul.hasan on 12/9/2021 10:46 AM
 * github : https://github.com/rhmtechno
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MailRequestDto {
    private String body;
    private String to;
    private String from;
    private String subject;
    private String attachmentUrl;
    private String templateName;
    private String attachmentName;
    private Boolean isAttachment=false;
}
