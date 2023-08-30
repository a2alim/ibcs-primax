package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.trainninginstitute.enums.Gender;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrainersListView {

    private String name;

    private String address;

    private String currentJobInstituteName;

    private String currentPosition;

    private String phone;

    private String email;

    private Gender gender;

    private Integer age;

    private MinioAttachment profileImage;

    private Long nidNumber;

    private MinioAttachment nidImage;

    private List<TrainersAcademicBackgroundList> trainersAcademicBackgroundList;

    private String lastAcademicDegree;
}
