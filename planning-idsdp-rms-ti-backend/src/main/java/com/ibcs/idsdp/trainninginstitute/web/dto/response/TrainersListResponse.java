package com.ibcs.idsdp.trainninginstitute.web.dto.response;


import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class TrainersListResponse extends UuidIdHolderRequestBodyDTO {
    private Long profileId;
    private TrainingInstituteProfileModel profileModel;
    private String name;
    private String institute;
    private String designation;
    private String mobileNo;
    private String gender;
    private String email;
    private String lastAcademicDeg;


}
