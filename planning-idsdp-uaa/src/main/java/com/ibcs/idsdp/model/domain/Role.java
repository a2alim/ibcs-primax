package com.ibcs.idsdp.model.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

import static com.ibcs.idsdp.constants.TableNameConstants.ROLE_TABLE_NAME;

@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = ROLE_TABLE_NAME)
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    @Column(name = "ROLE_NAME", unique = true)
    private String roleName;

    @Column(name = "ROLE_DESCRIPTION")
    private String roleDescription;

    @Column(name = "IS_ROLE_DELETE")
    private Boolean isRoleDelete;

    @Column(name = "PRIORITY")
    private Integer priority;
}
