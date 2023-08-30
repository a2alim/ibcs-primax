package com.ibcs.idsdp.rdpprtapp.model.domain.annexIII_aGoods;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "rdpp_annexure_iii_goods_work_service_details")
@EntityListeners(AuditingEntityListener.class)
public class AnnexureGoodsDetails extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "rdpp_annexure_iii_goods_work_service")
    private AnnexureGoods annexureGoods;


    @Column(length=255)
    private String packageName;


    @Column(length=255)
    private String tappGoods;


    private Long unitId;


    private Integer quantity;


    private Long procurementMethodId;


    private Long procurementTypeId;


    @Column(length=255)
    private String contractApproveAuthoriity;


    @Column(columnDefinition="TEXT")
    private String sourceOfFund;


    @Column(length=255)
    private Double estdCostAmount;


    @Column(columnDefinition="TEXT")
    private String invitationForTenderWork;


    @Column(columnDefinition="TEXT")
    private String packageDppTppService;


    private LocalDate invitationForEoi;

    @Column(columnDefinition="TEXT")
    private String issueOfRfp;

    private LocalDate invitationForTender;

    private LocalDate signingOfContract;

    private LocalDate completionOfContract;



}
