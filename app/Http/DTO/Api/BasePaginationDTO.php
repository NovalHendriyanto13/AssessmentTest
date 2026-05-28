<?php
namespace App\Http\DTO\Api;

class BasePaginationDTO
{
    public function __construct(
        public string $responseNaming,
        public array $items,
        public int $currentPage,
        public int $lastPage,
        public int $perPage,
        public int $total,
        public array $links
    ) {}

    public static function fromPaginator($paginator, string $name = 'data'): self
    {
        $items = static::setItems($paginator);
        return new self(
            responseNaming: $name,
            items: $items,
            currentPage: $paginator->currentPage(),
            lastPage: $paginator->lastPage(),
            perPage: $paginator->perPage(),
            total: $paginator->total(),
            links: $paginator->linkCollection()->toArray(),
        );
    }

    public static function setItems($paginator)
    {
        return $paginator->items();
    }

    public function toArray(): array
    {
        $name = $this->responseNaming;
        return [
            'page' => $this->currentPage,
            $name => $this->items,
            'meta' => [
                'current_page' => $this->currentPage,
                'last_page' => $this->lastPage,
                'per_page' => $this->perPage,
                'total' => $this->total,
                'links' => $this->links,
            ],
        ];
    }
}