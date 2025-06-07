<?php

namespace App\Repositories\Contracts;

use App\Models\Booking;

interface BookingRepositoryInterface
{
    public function all();
    public function find(int $id): ?Booking;
    public function create(array $data): Booking;
    public function update(int $id, array $data): Booking;
    public function delete(int $id): bool;
    public function getByUser(int $userId);
}
