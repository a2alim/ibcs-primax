package com.ibcs.idsdp.model.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

import static com.ibcs.idsdp.constants.TableNameConstants.USER_ROLE_TABLE_NAME;

@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = USER_ROLE_TABLE_NAME)

public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "ROLE_ID")
    private int roleId;

}
