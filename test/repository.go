package example

import (
	"context"
	"database/sql"
	"errors"
)

var ErrUserNotFound = errors.New("user not found")

type Repository interface {
	GetUser(ctx context.Context, id int64) (*User, error)
	CreateUser(ctx context.Context, user *User) error
}

type User struct {
	ID    int64  `json:"id" db:"id"`
	Email string `json:"email" db:"email"`
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

type repository struct {
	db *sql.DB
}

func (r *repository) GetUser(ctx context.Context, id int64) (*User, error) {
	return nil, ErrUserNotFound
}

func (r *repository) CreateUser(ctx context.Context, user *User) error {
	return nil
}