package ir.piana.business.isms.module.general.data.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "BRANCH")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BranchSelectable implements Serializable {
    /** identifier field */
    @Id
    @Column(name = "BRANCH_ID")
    private Long id;

    /** persistent field */
    @Column(name = "BRANCH_NAME")
    private String name;
}
