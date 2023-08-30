package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity(name = "rtapp_annexure_two_main")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RtappAnnexureTwoEntity extends BaseEntity {

    @OneToOne
    private Attachment attachment;

    @NotNull
    private Long rtappId;

    @NotNull
    @Column(length=50)
    private String rtappUuid;

}
