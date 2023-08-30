package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "fs_members")
@EntityListeners(AuditingEntityListener.class)
public class Member extends BaseEntity {

//    @JoinColumn(name = "committee_id")
//    @ManyToOne
//    private Committee committee;
    @NotNull
    private String memberName;
    @NotNull
    private String designation;
    @NotNull
    private String phone;
    @NotNull
    private String email;
    @NotNull
    private String role;

}
