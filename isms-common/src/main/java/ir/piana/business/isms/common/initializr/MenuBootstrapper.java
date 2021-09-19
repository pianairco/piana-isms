package ir.piana.business.isms.common.initializr;

import ir.piana.business.isms.common.model.MenuModel;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component("menuBootstrapper")
public class MenuBootstrapper {
    private List<MenuModel> menuModels;

    @PostConstruct
    public void init() {
        menuModels = new ArrayList<>();
    }

    public void addMenuModels(List<MenuModel> menuModels) {
        this.menuModels.addAll(menuModels);
    }

    public List<MenuModel> getMenuModels() {
        return Collections.unmodifiableList(menuModels);
    }
}
