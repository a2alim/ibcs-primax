package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "m1_researcher_profile_publication_info")
public class PublicationInfo extends BaseEntity {
    @Column(nullable = false)
    long profilePersonalInfoId;

    @Column(nullable = false)
    String publishedIn;

    @Column(nullable = false, length = 255)
    String articleTitle;

    @Column(nullable = false)
    String roleInTeam;

    @Column(nullable = false)
    Long journalPaperNature;

    @Column(nullable = false)
    String publicationDate;

    @Column(length = 150)
    String issn;

    @Column( length = 150)
    String isbn;

    @Column(nullable = false)
    boolean isEditable;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment fileUploadModel;
    
    private Double orchid; 


}
