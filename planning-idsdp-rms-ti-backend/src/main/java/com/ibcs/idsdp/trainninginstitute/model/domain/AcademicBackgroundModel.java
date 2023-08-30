package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
@Entity
@Table(name = "M3_ACADEMIC_BACKGROUND")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AcademicBackgroundModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;

//    @Column(length = 500)
//    private String address;

    private String examinationName;

    private Long resultId;

    private Integer passingYear;

    private String instituteName;

    private String board;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment certificateImage;
}
