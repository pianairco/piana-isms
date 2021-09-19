package ir.piana.business.isms.module.auth.data.entity;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
@SequenceGenerator(name = "master_seq", initialValue = 1, sequenceName = "master_seq", allocationSize = 1)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "master_seq")
    @Column(name = "ID")
    private long id;
    @Column(name = "USERNAME")
    private String username;
    @Column(name = "USER_UUID")
    private String userId;
    @Column(name = "email")
    private String email;
    @Column(name = "mobile")
    private String mobile;
    @Column
    private String password;
    @Column(name = "form_password")
    private String formPassword;
    @Column(name = "email_verified")
    private boolean emailVerified;
    @Column
    private String name;
    @Column(name = "picture_url")
    private String pictureUrl;
    @Column
    private String locale;
    @Column(name = "family_name")
    private String familyName;
    @Column(name = "given_name")
    private String givenName;
    @OneToMany(mappedBy = "userId", fetch = FetchType.EAGER)
    private List<UserRolesEntity> userRolesEntities;
}
