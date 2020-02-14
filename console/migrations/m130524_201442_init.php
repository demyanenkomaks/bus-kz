<?php

use yii\db\Migration;

class m130524_201442_init extends Migration
{
    public function up()
    {
        $time = time();

        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            // http://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%user}}', [
            'id' => $this->primaryKey(),
            'username' => $this->string()->notNull()->unique(),
            'auth_key' => $this->string(32)->notNull(),
            'password_hash' => $this->string()->notNull(),
            'password_reset_token' => $this->string()->unique(),
            'email' => $this->string()->unique(),

            'status' => $this->smallInteger()->notNull()->defaultValue(10),
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ], $tableOptions);

        $this->insert('{{%user}}', [
            'username' => 'root',
            'auth_key' => 'ZSKAyYz6yDburJqnaOtbW4EiuYrtmeI9',
            'password_hash' => '$2y$13$XLH/Isw383.MuW3RAQf3ouJfLZNYgqbALChRMIFEWJ.pL56rHjSrS',
            'password_reset_token' => null,
            'email' => null,
            'status' => '10',
            'created_at' => $time,
            'updated_at' => $time,
        ]);
    }

    public function down()
    {
        $this->dropTable('{{%user}}');
    }
}
