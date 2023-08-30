package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 1/6/22
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class TrainingInstituteResponse {

    private String instituteName;
    private int totalPertinentCount;
    private int courseCompletedPertinentCount;
}
