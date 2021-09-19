package ir.piana.business.isms.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuModel {
    private Long id;
    @JsonProperty("parent_id")
    private Long parentId;
    private String title;
    private String type;
    private String icon;
    private String active;
    private String link;
    private List<MenuModel> children;

//    public void addSubMenu(MenuModel menuModel) {
////        if (CommonUtils.isNull(subMenus))
////            subMenus = new ArrayList<>();
//        subMenus.add(menuModel);
//    }
}
