"""add_refresh_tokens_table

Revision ID: c36bcf00e922
Revises: d3dc52a041bd
Create Date: 2025-07-06 14:52:45.736214

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c36bcf00e922'
down_revision: Union[str, Sequence[str], None] = 'd3dc52a041bd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
