package ir.piana.business.isms.module.auth.data.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "user_roles")
@SequenceGenerator(name = "master_seq", initialValue = 1, sequenceName = "master_seq", allocationSize = 50)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserRolesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "master_seq")
    @Column(name = "id")
    private long id;
    @Column(name = "user_id")
    private long userId;
    @Column(name = "role_name")
    private String roleName;
}
