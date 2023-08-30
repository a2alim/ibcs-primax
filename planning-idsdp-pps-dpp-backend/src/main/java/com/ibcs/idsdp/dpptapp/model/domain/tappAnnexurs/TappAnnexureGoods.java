package com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tapp_annexure_goods_service")
@EntityListeners(AuditingEntityListener.class)
public class TappAnnexureGoods extends BaseEntity {

    @NotNull
    private Double totalAmount;

    @NotNull
    private Boolean status;

    @NotNull
    @Column(length=20)
    private String formType;

    @NotNull
    private Long projectConceptMasterId;

    @NotNull
    @Column(length=50)
    private String projectConceptUuid;

}
