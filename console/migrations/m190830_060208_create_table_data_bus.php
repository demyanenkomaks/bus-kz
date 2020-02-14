<?php

use yii\db\Migration;

/**
 * Class m190830_060208_create_table_data_bus
 */
class m190830_060208_create_table_data_bus extends Migration
{
    const TABLE = '{{%data_bus}}';
    const TABLE_bus = '{{%bus}}';

    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable(self::TABLE, [
            'id' => $this->primaryKey(),
            'retranslator' => $this->string()->unique()->notNull(),
            'd_t' => $this->integer()->notNull(),
            'lat' => $this->string()->notNull(),
            'lng' => $this->string()->notNull(),
            'course' => $this->string()->notNull(),
            'speed' => $this->integer(),
            'updated_at' => $this->integer(),

        ]);


        $this->createIndex(
            'bus_to_route_ibfk_2',
            self::TABLE_bus,
            'retranslator_id'
        );


        $this->addForeignKey(
            'bus_to_route_ibfk_2',
            self::TABLE_bus,
            'retranslator_id',
            self::TABLE,
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
