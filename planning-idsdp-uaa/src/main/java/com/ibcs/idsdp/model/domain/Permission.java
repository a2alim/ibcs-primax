package com.ibcs.idsdp.model.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

import static com.ibcs.idsdp.constants.TableNameConstants.PERMISSION_TABLE_NAME;

@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = PERMISSION_TABLE_NAME)
public class Permission {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private int id;

	@Column(name = "PERMISSION_NAME", unique = true)
	private String permissionName;


}
