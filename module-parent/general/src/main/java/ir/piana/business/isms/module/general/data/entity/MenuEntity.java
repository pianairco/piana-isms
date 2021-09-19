package ir.piana.business.isms.module.general.data.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "MENU")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuEntity implements Serializable {
    /** identifier field */
    @Id
    @Column(name = "ID")
    private Long id;

    /** persistent field */
    @Column(name = "PARENT_ID")
    private Long parentId;

    /** persistent field */
    @Column(name = "TITLE")
    private String title;

    /** persistent field */
    @Column(name = "LINK")
    private String link;
}
