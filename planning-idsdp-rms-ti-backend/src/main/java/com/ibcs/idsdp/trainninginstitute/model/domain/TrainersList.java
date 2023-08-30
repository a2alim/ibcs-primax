package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

/**
 * Created by : rakibul.hasan on 3/27/2022 5:03 PM
 * github : https://github.com/rhmtechno
 */
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
public class TrainersList extends BaseEntity {

    private String name;
    private String institute;
    private String designation;
    private String mobileNo;
    private String gender;
    private String email;
    private String lastAcademicDeg;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trainingInstituteProfileModel_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "FK_TRAINERS_LIST"))
    private TrainingInstituteProfileModel profileModel;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TrainersList that = (TrainersList) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
