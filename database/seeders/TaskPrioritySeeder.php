<?php

namespace Database\Seeders;

use App\Models\TaskPriority;
use Illuminate\Database\Seeder;

class TaskPrioritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TaskPriority::create(['label' => 'Very high', 'color' => 'red', 'order' => 1]);
        TaskPriority::create(['label' => 'High', 'color' => 'orange', 'order' => 2]);
        TaskPriority::create(['label' => 'Medium', 'color' => 'yellow', 'order' => 3]);
        TaskPriority::create(['label' => 'Low', 'color' => 'sky', 'order' => 4]);
        TaskPriority::create(['label' => 'Very low', 'color' => 'emerald', 'order' => 5]);
    }
}
