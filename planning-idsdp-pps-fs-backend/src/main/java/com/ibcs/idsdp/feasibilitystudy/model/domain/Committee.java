package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "fs_committee_managements")
@EntityListeners(AuditingEntityListener.class)
public class Committee extends BaseEntity {

    @NotNull
    private String committeeName;

    @NotNull
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    private LocalDate dateOfFormation;

    @OneToOne
    private Attachment attachmentId;

    @NotNull
    private Long fspMasterId;

    @JoinColumn(name = "committe_id")
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Member> members;

}
