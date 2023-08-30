package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;

import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrainersAcademicBackgroundList {

    private Long id;
    private String subject;

    private String examinationName;

    private Long resultId;

    private Integer passingYear;

    private String instituteName;

    private String board;

    private MinioAttachment certificateImage;
}
