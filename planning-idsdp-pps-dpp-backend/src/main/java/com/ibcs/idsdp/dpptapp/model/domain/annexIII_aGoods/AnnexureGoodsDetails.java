package com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods;

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
@Table(name = "dpp_annexure_iii_goods_work_service_details")
@EntityListeners(AuditingEntityListener.class)
public class AnnexureGoodsDetails extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "annexure_goodsWorkService_id")
    private AnnexureGoods annexureGoods;

    @NotNull
    @Column(length=255)
    private String packageName;

    @NotNull
    @Column(columnDefinition="TEXT")
    private String tappGoods;

    @NotNull
    private Long unitId;

    @NotNull
    private Double quantity;

    @NotNull
    private Long procurementMethodId;

    @NotNull
    private Long procurementTypeId;

    @NotNull
    @Column(length=255)
    private String contractApproveAuthoriity;

    @NotNull
    @Column(columnDefinition="TEXT")
    private String sourceOfFund;

    @NotNull
    @Column(length=255)
    private Double estdCostAmount;

    @NotNull
    @Column(columnDefinition="TEXT")
    private String invitationForTenderWork;

    @NotNull
    @Column(columnDefinition="TEXT")
    private String packageDppTppService;

    @NotNull
    private LocalDate invitationForEoi;

    @NotNull
    @Column(columnDefinition="TEXT")
    private String issueOfRfp;

    private LocalDate invitationForTender;

    private LocalDate signingOfContract;

    private LocalDate completionOfContract;



}
