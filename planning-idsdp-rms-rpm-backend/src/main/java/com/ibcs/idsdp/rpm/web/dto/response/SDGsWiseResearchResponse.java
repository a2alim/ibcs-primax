package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 1/6/22
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class SDGsWiseResearchResponse {
    private int SDGsId;
    private String SDGsName;
    private int totalResearchCount;
}
