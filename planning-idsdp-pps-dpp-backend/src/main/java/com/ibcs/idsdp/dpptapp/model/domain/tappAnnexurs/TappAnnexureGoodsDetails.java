package com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.Date;

@Data
@Entity
@Table(name = "tapp_annexure_goods_service_details")
@EntityListeners(AuditingEntityListener.class)
public class TappAnnexureGoodsDetails extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "tapp_annexure_goods_service_id")
    private TappAnnexureGoods tappAnnexureGoods;

    @NotNull
    @Column(columnDefinition = "TEXT")
    private String packageName;

    @NotNull
    @Column(columnDefinition = "TEXT")
    private String tappGoods;

    @NotNull
    private Long unitId;

    @NotNull
    private Integer quantity;

    @NotNull
    private Long procurementMethodId;

    @NotNull
    private Long procurementTypeId;

    @NotNull
    @Column(columnDefinition = "TEXT")
    private String contractApproveAuthoriity;

    @NotNull
    private String sourceOfFund;

    @NotNull
    @Column(length=255)
    private Double estdCostAmount;

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

    private LocalDate invitationForTender;

    private LocalDate signingOfContract;

    private LocalDate completionOfContract;

}
