<?php

use yii\db\Migration;

/**
 * Class m190909_080750_create_table_data_bus_history2
 */
class m190909_080750_create_table_data_bus_history2 extends Migration
{
    const TABLE = '{{%data_bus_history2}}';

    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable(self::TABLE, [
            'id' => $this->primaryKey(),
            'retranslator' => $this->string()->notNull(),
            'd_t' => $this->integer()->notNull(),
            'lat' => $this->string()->notNull(),
            'lng' => $this->string()->notNull(),
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
