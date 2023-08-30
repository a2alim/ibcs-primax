package com.ibcs.idsdp.rmsConfigration.client.dto.response;

import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 11/7/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class FileUploadResponse {
    private String bucketName;
    private String fileName;
    private String downloadUrl;
}
