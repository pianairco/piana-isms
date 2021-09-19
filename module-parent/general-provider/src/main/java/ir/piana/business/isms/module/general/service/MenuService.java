package ir.piana.business.isms.module.general.service;

import ir.piana.business.isms.common.data.util.EntityManagerQueryExecutor;
import ir.piana.business.isms.module.general.data.entity.MenuEntity;
import ir.piana.business.isms.module.general.data.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

//@Component
public class MenuService {

    @Autowired
    EntityManagerQueryExecutor entityManagerQueryExecutor;

    @Autowired
    List<EntityManager> entityManagers;

    @Autowired
    MenuRepository menuRepository;

    @PostConstruct
    @Transactional(propagation = Propagation.REQUIRED)
    public void  init() {
        /*String t = entityManagerQueryExecutor.queryForObject("select title from menu where id = 113954756");
        BigDecimal i = entityManagerQueryExecutor.queryForObject("select id from menu where id = 113954756");
        int count = entityManagerQueryExecutor.update("update menu set title = ? where id = ?",
                new Object[] {"save4", 113954761},
                new int[] {1, 2});
        Map<String, Object> aMap = entityManagerQueryExecutor.queryForMap("select * from menu where id = 113954756");
        List<Map<String, Object>> maps = entityManagerQueryExecutor.queryForList("select * from menu");
        Map<String, Object> map = maps.get(0);
        BigDecimal id = (BigDecimal) map.get("ID");
        String title = (String) map.get("TITLE");*/

        /*if(entityManagers.size() > 0) {
            Query query = entityManagers.get(0).createNativeQuery("select * from menu");
            query.getResultList();
        }*/

//        menuRepository.findPrepared("select * from Menu");
//        this.save1();
//        this.save2();
//        this.rolledBack();
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public List<MenuEntity> list() {
        if(entityManagers.size() > 0) {
            Query query = entityManagers.get(0).createNativeQuery("select * from menu");
            return query.getResultList();
        }

        return null;

//        jdbcTemplate.update("insert into menu (id, title) values (hibernate_sequence.nextval, 'save1')");
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void save1() {
        /*Query nativeQuery = entityManagerFactory.createEntityManager().createNativeQuery(
                "insert into menu (id, title) values (hibernate_sequence.nextval, 'save1')");
        nativeQuery.executeUpdate();*/
//        jdbcTemplate.update("insert into menu (id, title) values (hibernate_sequence.nextval, 'save1')");
        if(entityManagers.size() > 0) {
            Query query = entityManagers.get(1).createNativeQuery("insert into menu (id, title) values (hibernate_sequence.nextval, 'save1')");
            query.executeUpdate();
        }
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void save2() {
        /*Query nativeQuery = entityManagerFactory.createEntityManager().createNativeQuery(
                "insert into menu (id, title) values (hibernate_sequence.nextval, 'save2')");
        nativeQuery.executeUpdate();*/
//        jdbcTemplate.update("insert into menu (id, title) values (hibernate_sequence.nextval, 'save2')");
        Query query = entityManagers.get(1).createNativeQuery("insert into menu (id, title) values (hibernate_sequence.nextval, 'save2')");
        query.executeUpdate();
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void rolledBack() {
        throw new RuntimeException();
    }
}
