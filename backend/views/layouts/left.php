<aside class="main-sidebar">

    <section class="sidebar">
        <?php
//        use mdm\admin\components\Helper;

        function thisPage($controller,$action="*"){
            if(!is_array($action)&&$action!='*')
            {
                $action = explode(",",$action);
            }
            $_this = \Yii::$app ;
            return ($_this->controller->id==$controller)&&($action=="*")?1:($_this->controller->id==$controller&&in_array($_this->controller->action->id,$action));
        }

//        debug(\Yii::$app->controller->id);
//        debug(\Yii::$app->controller->action->id);
//        die;

        $menuItems = [
            ['label' => 'Автобусы', 'icon' => 'bus', 'url' => ['/bus/index'], 'active' => thisPage( 'bus')],
            ['label' => 'Остановки', 'icon' => 'bars', 'url' => ['/bus-stop/index'], 'active' => thisPage( 'bus-stop')],
            ['label' => 'Маршруты', 'icon' => 'sitemap', 'url' => ['/bus-route/index'], 'active' => thisPage( 'bus-route')],
            ['label' => 'Пользователи', 'icon' => 'users', 'url' => ['/user/index'], 'active' => thisPage( 'user')],
//            ['label' => 'data-bus-history', 'icon' => 'history', 'url' => ['/data-bus-history/index'], 'active' => thisPage( 'data-bus-history')],
            ['label' => 'Распределить автобусы', 'icon' => 'file-excel-o', 'url' => ['/pars/index'], 'active' => thisPage( 'pars')],

        ];
//        $menuItem = Helper::filter($menuItems);
        ?>

        <?= dmstr\widgets\Menu::widget(
            [
                'options' => ['class' => 'sidebar-menu tree', 'data-widget'=> 'tree'],
                'items' => $menuItems,
            ]
        ) ?>

    </section>

</aside>
