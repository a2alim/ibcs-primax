package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.util.Date;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_TRAINING_INSTITUTE_PROFILE")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TrainingInstituteProfileModel extends BaseEntity {

    @Column(unique = true)
    private String userId;

    private String userType;   

    private String designation;   

    private Date dateOfBirth;
    
    private String trainingInstituteName;

    private String headOfInstituteName;

    private String mobileNumber;
    
    private String email;

    private String permanentAddress;

    private String nidNo;

    private String presentAddress;

    private Boolean audioVisual;
    private Boolean trainingRoom;
    private Boolean supportingStaff;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment profileImage;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment signImage;
    
    private String telephoneNumber;
    private String bankName;
    private String accountName;
    private String accountNumber;
    private String routingNumber;
}
