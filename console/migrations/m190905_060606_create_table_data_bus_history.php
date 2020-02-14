<?php

use yii\db\Migration;

/**
 * Class m190905_060606_create_table_data_bus_history
 */
class m190905_060606_create_table_data_bus_history extends Migration
{
    const TABLE = '{{%data_bus_history}}';

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
