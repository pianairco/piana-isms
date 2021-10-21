package ir.piana.business.isms.module.riskmanagement.data.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "consequence_parameters_attribute")
@SequenceGenerator(name = "master_seq", initialValue = 1, sequenceName = "master_seq", allocationSize = 50)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ConsequenceParametersAttributeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "master_seq")
    @Column(name = "ID")
    private long id;
    @Column(name = "CONSEQUENCE_PARAMETERS_TYPE_ID")
    @Basic(fetch = FetchType.LAZY)
    private Long consequenceParametersTypeId;
    @Column(name = "ORDERS")
    @Basic(fetch = FetchType.LAZY)
    private Long orders;
    @Column(name = "VALUE")
    private long value;
    @Column(name = "LABEL")
    private String label;

    public ConsequenceParametersAttributeEntity(long id, long value, String label) {
        this.id = id;
        this.value = value;
        this.label = label;
    }
}
