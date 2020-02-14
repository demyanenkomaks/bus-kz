<?php

use yii\db\Migration;

/**
 * Class m190926_112703_addColumn_bus_route_coordinates_orders
 */
class m190926_112703_addColumn_bus_route_coordinates_orders extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%bus_route_coordinates}}', 'orders', $this->integer());
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m190926_112703_addColumn_bus_route_coordinates_orders cannot be reverted.\n";

        return false;
    }

}
