package com.ibcs.idsdp.idsdpconfigration.model.domain.annexIII_aGoods;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigInteger;
import java.util.Date;

@Data
@Entity
@Table(name = "dpp_annexure_iii_a_goods_details")
@EntityListeners(AuditingEntityListener.class)
public class AnnexureGoodsDetails extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "annexure_goods_id")
    private AnnexureGoods annexureGoods;

    @NotNull
    @Column(length=255)
    private String packageName;

    @NotNull
    @Column(length=255)
    private String tappGoods;

    @NotNull
    private Long unitId;

    @NotNull
    private Double quantity;

    @NotNull
    private BigInteger procurementMethodId;

    @NotNull
    private BigInteger procurementTypeId;

    @NotNull
    @Column(length=255)
    private String contractApproveAuthoriity;

    @NotNull
    private String sourceOfFund;

    @NotNull
    @Column(length=255)
    private Double estdCost;

    @NotNull
    @Column(length=255)
    private String invitationForTenderWork;

    @NotNull
    @Column(length=255)
    private String packageDppTppService;

    @NotNull
    @Column(length=255)
    private String invitationForEoi;

    @NotNull
    @Column(length=255)
    private String issueOfRfp;

    private Date invitationForTender;

    private Date signingOfContract;

    private Date completionOfContract;



}
