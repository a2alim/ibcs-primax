package com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tapp_annexure_four")
@EntityListeners(AuditingEntityListener.class)
public class TappAnnexureFour extends BaseEntity {
    @OneToOne
    private Attachment attachment;

    @NotNull
    private Long projectConceptMasterId;

    @NotNull
    @Column(length=50)
    private String projectConceptUuid;
}
