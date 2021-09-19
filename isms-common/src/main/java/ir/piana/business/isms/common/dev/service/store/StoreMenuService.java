package ir.piana.business.isms.common.dev.service.store;

import ir.piana.business.isms.common.dev.model.StoreMenu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Scope("singleton")
@Profile("production")
public class StoreMenuService {
    @Autowired
    private StoreMenuProperties storeMenuMap;

    public List<StoreMenu> getStoreMenus() {
        return storeMenuMap.getGroups();
    }
}
