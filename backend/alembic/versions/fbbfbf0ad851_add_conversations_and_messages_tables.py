"""add_conversations_and_messages_tables

Revision ID: fbbfbf0ad851
Revises: c36bcf00e922
Create Date: 2025-07-06 18:24:02.918667

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fbbfbf0ad851'
down_revision: Union[str, Sequence[str], None] = 'c36bcf00e922'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
