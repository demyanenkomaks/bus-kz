<?php

use yii\db\Migration;

/**
 * Class m190829_073529_create_table_bus
 */
class m190829_073529_create_table_bus extends Migration
{
    const TABLE = '{{%bus}}';
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable(self::TABLE, [
            'id' => $this->primaryKey(),
            'mark' => $this->string()->notNull(),
            'model' => $this->string(),
            'number_sign' => $this->string(),
            'number_bus' => $this->string(),
            'retranslator_id' => $this->integer(),
            'route_id' => $this->integer(),
        ]);


        $this->createIndex(
            'bus_to_route_ibfk_1',
            self::TABLE,
            'route_id'
        );


        $this->addForeignKey(
            'bus_to_route_ibfk_1',
            self::TABLE,
            'route_id',
            'bus_route',
            'id',
            'SET NULL',
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
