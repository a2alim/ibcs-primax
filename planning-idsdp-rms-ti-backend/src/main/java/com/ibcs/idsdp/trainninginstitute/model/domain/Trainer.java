package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.trainninginstitute.enums.Gender;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
@Entity
@Table(name = "M3_TRAINER")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Trainer extends BaseEntity {

    private String name;
    
    private String currentJobInstituteName;
    
    private String currentPosition;
    
    @Column(length = 20)
    private String Phone;
    
    private Gender Gender;
    
    private String Email;
    
    private String lastAcademicDegree;  
    
    private Long fiscalYearId; 
    
    private Boolean isActive;
    
    private Boolean isEditable;
    
    private Boolean isSubmitted;
    
    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.EAGER, targetEntity = ProposalModel.class)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

    @JsonIgnore
    @LazyCollection(LazyCollectionOption.FALSE)
    @ManyToMany(targetEntity = CourseScheduleModel.class, cascade = {CascadeType.DETACH, CascadeType.REFRESH})
    @JoinTable(name = "M3_COURSE_SCHEDULE_M3_TRAINER",
            inverseJoinColumns = @JoinColumn(name = "M3_COURSE_SCHEDULE_ID"),
            joinColumns = @JoinColumn(name = "M3_TRAINER_ID"))
    List<CourseScheduleModel> courseScheduleModels;

   

}
