<?php

use yii\db\Migration;

/**
 * Class m190816_083322_create_table_bus_route
 */
class m190816_083322_create_table_bus_route extends Migration
{
    const TABLE = '{{%bus_route}}';
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable(self::TABLE, [
            'id' => $this->primaryKey(),
            'number' => $this->string()->notNull(),
            'time_ot' => $this->time(),
            'time_do' => $this->time(),
            'cost' => $this->integer(),
            'display' => $this->boolean()->defaultValue(false),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable(self::TABLE);
    }
}
