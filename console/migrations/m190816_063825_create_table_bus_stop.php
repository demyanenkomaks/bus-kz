<?php

use yii\db\Migration;

/**
 * Class m190816_063825_create_table_bus_stop
 */
class m190816_063825_create_table_bus_stop extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%bus_stop}}', [
            'id' => $this->primaryKey(),
            'latitude' => $this->string()->notNull(),
            'longitude' => $this->string()->notNull(),
            'title' => $this->string()->notNull(),
            'side' => $this->integer(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%bus_stop}}');
    }

}
