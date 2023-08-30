package com.ibcs.idsdp.idsdpconfigration.model.domain.annexIII_aGoods;

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
@Table(name = "dpp_annexure_iii_a_goods")
@EntityListeners(AuditingEntityListener.class)
public class AnnexureGoods extends BaseEntity {

    @NotNull
    private Double total;

    @NotNull
    private Boolean status;

    @NotNull
    @Column(length=20)
    private String formType;

}
