package com.ibcs.idsdp.rpm.client.dto.response;

import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 10/6/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class FileUploadResponse {
    private String bucketName;
    private String fileName;
    private String downloadUrl;
}
