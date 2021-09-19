package ir.piana.business.isms.module.general.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.piana.business.isms.common.initializr.MenuBootstrapper;
import ir.piana.business.isms.common.model.MenuModel;
import ir.piana.business.isms.module.general.data.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/modules/general/menu")
public class MenuRest {
    @Autowired
    private MenuRepository menuRepository;

//    @Autowired
//    MenuService menuService;

    @Autowired
    @Qualifier("objectMapper")
    private ObjectMapper objectMapper;

    /*Map<Long, MenuModel> menuModelMap = null;
    List<MenuModel> menuModelList = null;
    List<MenuModel> menuModels = null;*/

    /*public Map find1() {
        ComponentSupplier componentSupplier = ComponentContainer.getInstance();
        ClassHunter classHunter = componentSupplier.getClassHunter();

        try (
                SearchResult result = classHunter.findBy(
                        //Highly optimized scanning by filtering resources before loading from ClassLoader
                        SearchConfig.forResources(
                                "org/springframework"
                        ).by(
                                ClassCriteria.create().byMembers(
                                        FieldCriteria.forEntireClassHierarchy().allThoseThatMatch((field) -> {
                                            return field.getAnnotation(MenuItems.class) != null;
                                        })
                                )
                        )
                )
        ) {

            Map classes = result.getClasses(ClassCriteria.create().byMembers(
                    FieldCriteria.forEntireClassHierarchy().allThoseThatMatch((field) -> {
                        return field.getAnnotation(MenuItems.class) != null;
                    })
            ));

            return classes;
        }
    }*/

    /*public List<String> find() {
        ComponentSupplier componentSupplier = ComponentContainer.getInstance();
        PathHelper pathHelper = componentSupplier.getPathHelper();
        ClassHunter classHunter = componentSupplier.getClassHunter();
        CacheableSearchConfig searchConfig = SearchConfig.forPaths(
                //Here you can add all absolute path you want:
                //both folders, zip and jar will be recursively scanned.
                //For example you can add: "C:\\Users\\user\\.m2"
                //With the row below the search will be executed on runtime Classpaths
                pathHelper.getMainClassPaths()
        ).by(
                ClassCriteria.create().allThoseThatMatch((cls) -> {
                    return
                            //Unconment one of this if you need to filter for package name
                            //cls.getPackage().getName().matches("regular expression") &&
                            //cls.getPackage().getName().startsWith("com") &&
                            //cls.getPackage().getName().equals("com.something") &&
                            cls.getAnnotation(MenuItems.class) != null &&
                                    cls.getAnnotation(MenuItemDefinable.class) != null;
                })
        );
        try (SearchResult searchResult = classHunter.loadInCache(searchConfig).find()) {

            List<String> pathsList = searchResult.getClasses().stream().map(cls ->
                    Arrays.asList(cls.getAnnotation(RequestMapping.class).value())
            ).flatMap(List::stream).distinct().collect(Collectors.toList());

            return pathsList;
        }
    }*/

    @PostConstruct
    public void init() throws IOException {
        /*menuModelList = Arrays.asList(objectMapper.readValue(
                FundRest.class.getResourceAsStream("/menu.json"), MenuModel[].class));
        menuModelMap = menuModelList.stream().filter(m -> m.getParentId() == null)
                .map(m -> {
                    m.setChildren(new ArrayList<>());
                    return m;
                }).collect(
                Collectors.toMap(MenuModel::getId, Function.identity()));
        menuModelList.stream().filter(m -> m.getParentId() != null).forEach(m -> {
            menuModelMap.get(m.getParentId()).getChildren().add(m);
        });
        menuModels = menuModelList.stream().filter(m -> m.getParentId() == null)
                .collect(Collectors.toList());*/
    }

    /*void initMenuMap() {
        try {
            menuModelMap = new LinkedHashMap<>();
            menuModelList = new ArrayList<>();
            List<MenuEntity> all = menuRepository.findAllOrderByParentIdAsc();
            Map<Long, List<MenuModel>> temp = new LinkedHashMap<>();
            for (MenuEntity menuEntity : all) {
                if (CommonUtils.isNull(menuEntity.getParentId())) {
                    if(!temp.containsKey(menuEntity.getId()))
                        temp.put(menuEntity.getId(), new ArrayList<>());

                    MenuModel menuModel = MenuModel.builder()
                            .id(menuEntity.getId())
                            .children(temp.get(menuEntity.getId()))
                            .title(menuEntity.getTitle())
                            .link(menuEntity.getLink()).build();
                    menuModelMap.put(menuModel.getId(), menuModel);
                    menuModelList.add(menuModel);
                } else {
                    MenuModel menuModel = MenuModel.builder()
                            .id(menuEntity.getId())
                            .parentId(menuEntity.getParentId())
                            .title(menuEntity.getTitle())
                            .link(menuEntity.getLink()).build();
                    if(!temp.containsKey(menuEntity.getParentId()))
                        temp.put(menuEntity.getParentId(), new ArrayList<>());
                    temp.get(menuEntity.getParentId()).add(menuModel);
//                    menuModelMap.get(menuModel.getParentId()).addSubMenu(menuModel);
                }
            }
        } catch (Exception e) {
            menuModelMap = null;
        }
    }*/

    @Autowired
    private MenuBootstrapper menuBootstrapper;

    @GetMapping(path = "list")
    public ResponseEntity<List<MenuModel>> getMenuModel() {
/*        if(menuModelMap == null)
            initMenuMap();
        if(menuModelMap == null)
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();*/
        return ResponseEntity.ok(menuBootstrapper.getMenuModels());
    }

    /*@GetMapping(path = "test")
    @Transactional(propagation = Propagation.REQUIRED)
    public ResponseEntity<String> test() {
        List<MenuEntity> list = menuService.list();

        menuService.save1();
        menuService.save2();

        List<MenuEntity> list2 = menuService.list();
//        menuService.rolledBack();
        return ResponseEntity.ok("sss");
    }*/
}
