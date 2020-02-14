<?php

use yii\db\Migration;

/**
 * Class m190816_084659_create_table_bus_route_coordinates
 */
class m190816_084659_create_table_bus_route_coordinates extends Migration
{
    const TABLE = '{{%bus_route_coordinates}}';
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable(self::TABLE, [
            'route_id' => $this->integer()->notNull(),
            'direction' => $this->integer()->notNull(),
            'latitude' => $this->string()->notNull(),
            'longitude' => $this->string()->notNull(),
        ]);

        $this->createIndex(
            'bus_route_coordinates_ibfk_1',
            self::TABLE,
            'route_id'
        );

        $this->addForeignKey(
            'bus_route_coordinates_ibfk_1',
            self::TABLE,
            'route_id',
            'bus_route',
            'id',
            'CASCADE',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable(self::TABLE);
    }

}
