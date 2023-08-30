package com.ibcs.idsdp.trainninginstitute.web.dto.request;


import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AcademicBackgroundRequest {
private Long id;
    private String subject;

    private String examinationName;

    private Long resultId;

    private Integer passingYear;

    private String instituteName;

    private String board;

    private MinioAttachment certificateImage;

}
