package ir.piana.business.isms.module.riskmanagement.data.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "consequence_parameters")
@SequenceGenerator(name = "master_seq", initialValue = 1, sequenceName = "master_seq", allocationSize = 50)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ConsequenceParametersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "master_seq")
    @Column(name = "ID")
    private long id;
    @Column(name = "consequence_parameters_type_id")
    private long consequenceParametersTypeId;
    @Column(name = "name")
    private String name;
    @Column(name = "alias")
    private String alias;
    @Column(name = "coefficient")
    private long coefficient;
}
