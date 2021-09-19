package ir.piana.business.isms.module.general.data.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "INSTRUMENT")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InstrumentSelectable implements Serializable {
    /** identifier field */
    @Id
    @Column(name = "INSTRUMENT_ID")
    private Long id;

    /** persistent field */
    @Column(name = "BOURSE_ACCOUNT")
    private String name;
}
