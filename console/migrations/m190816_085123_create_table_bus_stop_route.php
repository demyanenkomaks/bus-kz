<?php

use yii\db\Migration;

/**
 * Class m190816_085123_create_table_bus_stop_route
 */
class m190816_085123_create_table_bus_stop_route extends Migration
{
    const TABLE = '{{%bus_stop_route}}';
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable(self::TABLE, [
            'id' => $this->primaryKey(),
            'route_id' => $this->integer()->notNull(),
            'bus_stop_id' => $this->integer()->notNull(),
            'direction' => $this->integer()->notNull(),
            'orders' => $this->integer()->notNull(),
        ]);

        $this->createIndex(
            'bus_stop_route_ibfk_1',
            self::TABLE,
            'route_id'
        );

        $this->createIndex(
            'bus_stop_route_ibfk_2',
            self::TABLE,
            'route_id'
        );

        $this->addForeignKey(
            'bus_stop_route_ibfk_1',
            self::TABLE,
            'route_id',
            'bus_route',
            'id',
            'CASCADE',
            'CASCADE'
        );

        $this->addForeignKey(
            'bus_stop_route_ibfk_2',
            self::TABLE,
            'bus_stop_id',
            'bus_stop',
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
