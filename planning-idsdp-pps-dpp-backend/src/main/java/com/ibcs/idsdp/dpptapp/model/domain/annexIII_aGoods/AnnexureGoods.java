package com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "dpp_annexure_iii_goods_work_service")
@EntityListeners(AuditingEntityListener.class)
public class AnnexureGoods extends BaseEntity {

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
