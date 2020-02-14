<?php

use yii\db\Migration;

/**
 * Class m190924_115540_addColumn_bus_direction
 */
class m190924_115540_addColumn_bus_direction extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%bus}}', 'direction', $this->integer());
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m190924_115540_addColumn_bus_direction cannot be reverted.\n";

        return false;
    }

}
