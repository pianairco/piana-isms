package ir.piana.business.isms.module.riskmanagement.data.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "consequence_parameters_attribute")
@SequenceGenerator(name = "master_seq", initialValue = 1, sequenceName = "master_seq", allocationSize = 1)
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
    @Column(name = "consequence_parameters_type_id")
    @Basic(fetch = FetchType.LAZY)
    private Long consequenceParametersTypeId;
    @Column(name = "orders")
    @Basic(fetch = FetchType.LAZY)
    private Long orders;
    @Column(name = "value")
    private long value;
    @Column(name = "label")
    private String label;

    public ConsequenceParametersAttributeEntity(long id, long value, String label) {
        this.id = id;
        this.value = value;
        this.label = label;
    }
}
