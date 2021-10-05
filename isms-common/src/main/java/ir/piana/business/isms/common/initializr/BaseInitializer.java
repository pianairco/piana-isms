package ir.piana.business.isms.common.initializr;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.piana.business.isms.common.data.component.SpecificSchemaQueryExecutorProvider;
import ir.piana.business.isms.common.model.MenuModel;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public abstract class BaseInitializer {
    @Autowired
    private ApplicationContext ctx;
    @Autowired
    @Qualifier("menuBootstrapper")
    private MenuBootstrapper menuBootstrapper;
    @Autowired
    protected SpecificSchemaQueryExecutorProvider queryExecutorProvider;
    @Autowired
    @Qualifier("objectMapper")
    protected ObjectMapper objectMapper;
    public abstract InputStream getSupportSql();
    public abstract InputStream getAllSchemaSql();

    @PostConstruct
    public final void initData() {
        try (InputStream resourceAsStream = getSupportSql()) {
            if(resourceAsStream != null) {
                String[] split = new String[0];
                split = IOUtils.toString(resourceAsStream).split(";");

                for (String script : split) {
                    queryExecutorProvider.executeOnSupport(script);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        try (InputStream resourceAsStream = getAllSchemaSql()) {
            if(resourceAsStream != null) {
                String[] split = new String[0];
                split = IOUtils.toString(resourceAsStream).split(";");

                for (String script : split) {
//                    queryExecutorProvider.executeOnAllDataSources(script);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        initMenu();
    }

    public final void initMenu() {
        String menuPath = "/" + this.getClass().getPackage().getName()
                .replaceAll("\\.", "/").concat("/menu.json");
        try (InputStream resourceAsStream = this.getClass().getResourceAsStream(menuPath)) {
//        try (InputStream resourceAsStream = getMenuConfig()) {
            if(resourceAsStream != null) {
                List<MenuModel> menuModelList = Arrays.asList(objectMapper.readValue(
                        resourceAsStream, MenuModel[].class));
                menuModelList.forEach(m -> {
                    if(m.getTitle().equalsIgnoreCase("_divider_"))
                        m.setType("divider");
                    else if(m.getParentId() == null)
                        m.setType("dropdown");
                    else {
                        m.setType("simple");
                    }
                });
                Map<Long, MenuModel> menuModelMap = menuModelList.stream()
                        .filter(m -> m.getParentId() == null && !m.getTitle().equalsIgnoreCase("_divider_"))
                        .map(m -> {
                            m.setChildren(new ArrayList<>());
                            return m;
                        }).collect(
                                Collectors.toMap(MenuModel::getId, Function.identity()));
//                menuModelList.stream().filter()
                menuModelList.stream().filter(m -> m.getParentId() != null).forEach(m -> {
                    if(menuModelMap.containsKey(m.getParentId())) {
                        menuModelMap.get(m.getParentId()).getChildren().add(m);
                    } else {
                        Optional<MenuModel> first = menuModelList.stream().filter(n -> m.getParentId().equals(n.getId())).findFirst();
                        if(first.isPresent()) {
                            if(!first.get().getType().equalsIgnoreCase("dropdown")) {
                                first.get().setType("dropdown");
                                first.get().setChildren(new ArrayList<>());
                                menuModelMap.put(first.get().getId(), first.get());
                            }
                            first.get().getChildren().add(m);
                        }
                    }
                    if(m.getLink().contains(":")) {
                        String path = null;
                        String[] split = m.getLink().split(":");
                        Object bean = ctx.getBean(split[1]);
                        try {
                            Class<?> aClass = Class.forName(bean.getClass().getName().split("\\$\\$")[0]);
                            path = aClass.getAnnotation(RequestMapping.class).value()[0];
                            if (path.startsWith("/"))
                                path = path.substring(1);
                        } catch (ClassNotFoundException e) {
                            e.printStackTrace();
                        }
                        m.setLink(menuModelMap.get(m.getParentId()).getLink() + "/" +
                                split[0].concat(path != null ? "/" + path.replaceAll("\\/", "*") : ""));
                    } else {
                        m.setLink(menuModelMap.get(m.getParentId()).getLink() + "/" +
                                m.getLink());
                    }
                });
                menuBootstrapper.addMenuModels(menuModelList.stream().filter(m -> m.getParentId() == null)
                        .collect(Collectors.toList()));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
