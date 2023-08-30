package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import lombok.Data;

import javax.persistence.Column;

/**
 * @author moniruzzaman.rony
 * @create 10/3/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class CategoryWiseGrantAmountFilesRequest {

    private String fileName;

    private String fileUrl;

    private Boolean active;

}
