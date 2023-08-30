package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "municipality")
@EntityListeners(AuditingEntityListener.class)
public class Municipality extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "upazila_id")
  private UpaZilla upaZilla;
  private String nameEn;
  private String nameBn;
  private String code;
  private String geoCode;
  private String description;
  private Boolean status;
}
