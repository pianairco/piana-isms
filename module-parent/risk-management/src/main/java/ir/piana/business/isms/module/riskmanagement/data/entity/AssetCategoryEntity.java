package ir.piana.business.isms.module.riskmanagement.data.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "asset_category")
@SequenceGenerator(name = "master_seq", initialValue = 1, sequenceName = "master_seq", allocationSize = 1)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AssetCategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "master_seq")
    @Column(name = "ID")
    private long id;
    @Column(name = "asset_category_name")
    private String assetCategoryName;
    @Column(name = "parent_id")
    private Long parentId;
}
